import React,{Component} from 'react';
import './App.css'
import "tailwindcss/tailwind.css"
import Main from './components/Main'
import Circle from './components/Circles'
import DataOwner from './components/DataOwner'
import NavBar from './components/NavBar'
import Buyables from './components/Buyables'
import Tokens from './components/Tokens'
import Cred from './components/cred_card'
import nexyohub from './contracts/nexyohub.json'
import nexyocircle from './contracts/nexyocircle.json'
import nexyotransact from './contracts/nexyotransact.json'
import Web3 from 'web3';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

//
// const getWeb3 = () =>
//   new Promise((resolve,reject) => {
//     window.addEventListener('load', async () => {
//       if (window.ethereum) {
//         const web3=new Web3(window.ethereum);
//         try{
//           await window.ethereum.enable();
//           resolve(web3);
//         } catch (error){
//           reject(error);
//         }
//       }
//       else if(window.web3) {
//         const web3=window.web3;
//         console.log('Web3 Object Injetction detected');
//         resolve(web3);
//       }
//       else{
//         const provider=new Web3.providers.HttpProvider('http://127.0.0.1:8545');
//         const web3=new Web3(provider);
//         console.log('No Injector found using fallback address localhost');
//         resolve(web3);
//       }
//     });
//   });



class App extends Component {

    async loadConnection() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.send('eth_requestAccounts');
      }else {
        window.web3=new Web3(window.web3.currentProvider)
      }
    };

  async loadBlockchainData() {
    try {
      const web3 = window.web3;
      this.setState({web3: web3});
      const account=await web3.eth.getAccounts();
      this.setState({Uaccount: account[0]});
      const networkID=await web3.eth.net.getId();
      console.log('Connected to Chain', networkID, 'starting to load Contracts')
      const NexyoTransact=await nexyotransact.networks[networkID];
      this.setState({Taddress:NexyoTransact.address});
      console.log('Transaction Contract Address', this.state.Taddress)

      if (NexyoTransact) {
        let Trans=new web3.eth.Contract(nexyotransact.abi,this.state.Taddress);
        this.setState({Trans: Trans});
        console.log('Found transactional Contract')
        if (this.state.Trans) {console.log('Trans abi loaded', true);} else {console.log('Trans abi loaded', false);}
        let Contracts=await Trans.methods.listcontracts().call();
        this.setState({Contracts: Contracts}); // Need to clip this

        let NumberofHubs=await Trans.methods.returnNumberofHubswithinNetwork().call();
        let NumberofCircles=Contracts.length-NumberofHubs;
        this.setState({NumberofHubs:NumberofHubs});
        this.setState({NumberofCircles:NumberofCircles});

        let Hubs=Contracts.slice(0,NumberofHubs);
        this.setState({Hubs:Hubs});
        let Circles=Contracts.slice(NumberofHubs,NumberofHubs+NumberofCircles);
        this.setState({Circles:Circles});
        console.log( 'All Contracts with the Network \nHubs:', this.state.Hubs,'\nCircles:',this.state.Circles);

        let MyHubs=await Trans.methods.myhubs().call({from:this.state.Uaccount});
        this.setState({MyHubs: MyHubs}); // Need to clip this
        console.log( 'My Hubs', this.state.MyHubs,);
        let MyCircles=await Trans.methods.mycircles().call({from:this.state.Uaccount});
        this.setState({MyCircles: MyCircles});
        console.log('My Circles', this.state.MyCircles);
        let len=this.state.MyCircles.length;
        this.setState({CircleBalance:len});
        console.log('Transaction Contract Address', this.state.Taddress)
        if (this.state.SelectedHub==='0') {
          let myhub=Hubs[0][0];
          for (let i=0;i<NumberofHubs;i++) {
            if (MyHubs.includes(Hubs[i][3])) {myhub=Hubs[i][0]}
          }
          this.setState({SelectedHub: myhub});
          console.log('Selected Hub', this.state.SelectedHub)
        };
      };
      const NexyoHub=await nexyohub.networks[networkID];
      if(NexyoHub) {

        let Hub=await new web3.eth.Contract(nexyohub.abi,this.state.SelectedHub);
        this.setState({Hub: Hub}); // Need to clip this

        let Caddress=await Hub.methods.returnAddress().call();
        this.setState({Caddress: Caddress});

        let Oaddress=await Hub.methods.whoisOwner().call();
        this.setState({Oaddress: Oaddress.toString()});

        let ContractName=await Hub.methods.returnContractName().call();
        this.setState({ContractName: ContractName});

        let HubName=await Hub.methods.returnSign().call();
        this.setState({HubName: HubName});

        let Ubalance=await web3.eth.getBalance(this.state.Uaccount);
        this.setState({Ubalance: Ubalance});
        console.log('User\'s Ether', this.state.Ubalance)

        let DataOwnerPresent=await Hub.methods.isDataOwnerthere(this.state.Uaccount).call();
        this.setState({DataOwnerPresent: DataOwnerPresent});
        if (DataOwnerPresent) {
          console.log('Data Owner Present:', this.state.Uaccount);}

        let buyableArray=await Hub.methods.buyableTokens(account[0]).call();
        console.log(buyableArray)
        var len=buyableArray.length;
        let arr=[]
        for (let i=0; i<len;i++){
          let id=buyableArray[i];
          var newline=[id,
            await Hub.methods.ownerOf(id).call(),
            await Hub.methods.pointerOf(id).call(),
            await Hub.methods.priceOf(id).call(),
            await Hub.methods.tokenresellable(id).call(), //this returns false if token is resellable. This is confusing but solidity initializes everything with 0 and well... it is stupid but this is how i have done it!
            await Hub.methods.tokenownable(id).call() //this is the posix time in milliseconds when your right to connect is revoked. If 0 you are owner of the bloody thing...
          ];
          arr.push(newline);
          }
        console.log('Buyable Stuff', arr);
        this.setState({buyable: arr});

        let Pointers=await Hub.methods.useablePointers().call({from:this.state.Uaccount}); //This should be done in contract
        console.log(Pointers);
        this.setState({Pointers:[]});
        for (var x=0; x<Pointers.length; x++) {
          let des=await Hub.methods.doyouownPointer(Pointers[x]).call({from:this.state.Uaccount});
          console.log(des,Pointers[x]);
          if(des) {
            let pointerarray=this.state.Pointers.concat(Pointers[x]);
            this.setState({Pointers: pointerarray});
          }
        }
        console.log('Pointer',this.state.Pointers);

        let stuff= await Hub.methods.whatownsDataOwner(this.state.Uaccount).call();
        console.log('What Pointers does Data Owner own',stuff);

        if (Oaddress===this.state.Uaccount) {
          console.log('Contract owner present:', this.state.Uaccount);
          this.setState({OwnerPresent:true});

          let PointerstoApprove=await Hub.methods.PointerstoApprove().call({from:this.state.Uaccount});
          console.log('Pointers to approve', PointerstoApprove);
          this.setState({PointerstoApprove: PointerstoApprove});
        } else {
          this.setState({OwnerPresent:false});
        }

        let myTokens=await Hub.methods.myTokens(this.state.Uaccount).call();
        console.log('My token ids', myTokens)
        let UNFTbalance=myTokens.length;
        let TotalBalance=await this.state.Trans.methods.mytokens().call({from:this.state.Uaccount})
        let MyTokens=[]
        for (let i=0; i<UNFTbalance;i++) {
          let id=myTokens[i];
          newline=[id,// this is index 0!!!
            await Hub.methods.ownerOf(id).call(),
            await Hub.methods.pointerOf(id).call(),
            await Hub.methods.priceOf(id).call(),
            await Hub.methods.tokensellable(id).call(),
            await Hub.methods.tokenresellable(id).call(),
            await Hub.methods.tokenexpires(id).call()
          ];
          MyTokens.push(newline);
        }
        console.log('My Tokens', MyTokens);
        this.setState({MyTokens: MyTokens});
        this.setState({UNFTbalance: TotalBalance});

      } else {
        window.alert('Can\'t find Contract');
      };
      this.setState({finished:true});
    } catch(error) {
      console.log('Blockchain Data did not load as intented'+error);
    }
    };

  constructor(props) {
    super(props);
    this.state={
      ContractName:'Couldn\'t find Hub',
      HubName:'Couldn\'t find Hub',
      Caddress:'No Contract Connected',
      Oaddress:'Contract is not responding',
      Hub:{},
      Trans:{},
      DestroyCircle:{},
      addCircleUser:{},
      Taddress:'No known transaction Contract',
      Hubs:[],
      Circles:[],
      SelectedCircle:'Choose here',
      SelectedHub:'0',
      NumberofHubs:0,
      NumberofCircles:0,
      Uaccount:'No Web3 Connector passed',
      buyable:[],
      Ubalance:'0',
      UNFTbalance:'0',
      CircleBalance:'0',
      MyTokens:[],
      MyCircleTokens:[],
      MyHubs:[],
      MyCircles:[],
      Pointers:[],
      PointerstoApprove:[],
      web3: null,
      OwnerPresent:false,
      CircleChief:false,
      DataOwnerPresent:false,
      createHubMenu:false,
      newDataCircleMenu:false,
      newHubName:'',
      newHubSign:'',
      newCircleName:'',
      showCircles:false,
      finished:false
    }
  }

  next_token = async () => {
    return await this.state.Hub.methods.nextPointerid().call();
  }

  circletokens = async () => { //this is awfully expensive and needs a rework!
    let MyTokens=[]
    for (let i=0;i<this.state.NumberofCircles;i++) {
      if (this.state.Circles[i]._sign===this.state.SelectedCircle) {
        var add=this.state.Circles[i]._add
      }
    } if (!add) {return}
    const IC=new this.state.web3.eth.Contract(nexyocircle.abi,add);
    if (await IC.methods.amIelevatedRoll(this.state.Uaccount).call()) { //this is unsafe but the Blockchain side requires signature...
      this.setState({CircleChief:true})
      let boom=IC.methods.terminate;
      this.setState({DestroyCircle:boom});
      let addCircleUser=IC.methods.addUser;
      this.setState({addCircleUser:addCircleUser});
    }
    else {
      this.setState({CircleChief:false})}
    for (let i=0;i<this.state.NumberofHubs;i++) {
      let arr=await this.state.Trans.methods.myTokensHub(this.state.Hubs[i]._add,add).call();
      let CHub=new this.state.web3.eth.Contract(nexyohub.abi,this.state.Hubs[i]._add);
      for (let x=0; x<arr.length;x++) {
        let id=arr[x];
        let newline=[id,
          await CHub.methods.ownerOf(id).call(),
          await CHub.methods.pointerOf(id).call(),
          await CHub.methods.priceOf(id).call(),
          await CHub.methods.tokensellable(id).call(),
          await CHub.methods.tokenresellable(id).call(),
          await CHub.methods.tokenexpires(id).call(),
          this.state.Hubs[i]._add
        ];
        MyTokens.push(newline);
      }
    }
    console.log('Accessable Tokens',MyTokens);
    await this.setState({MyCircleTokens:MyTokens})
  }

  resttoken = async (e,msg,id,cadd) => {
    if (typeof cadd === 'undefined') {cadd=this.state.Caddress}
    console.log('Input',msg,id,cadd)
    await this.setState({finished: false});
    msg=msg.substring(2);
    console.log(msg);
    let hash=await window.web3.utils.sha3(msg);
    console.log(hash);
    let hmsg= await window.web3.eth.sign(hash,this.state.Uaccount);
    console.log(hmsg);
    const apicall=hash+id+hmsg+cadd;
    console.log(apicall);
    window.open('http://localhost:8090/verify/'+apicall,'Data','height=1280,width=720');
    await this.setState({finished: true});
  }

  deploy_nexyohub = async (e) => {
    e.preventDefault();
    await this.setState({finished: false});
    let decision=true;
    for(var x=0;x<this.state.Hubs.length;x++) {
      if (this.state.Hubs[x][this.state.Hubs.length-1]===this.state.newHubSign) {
        this.setState({newHubSign:'Sign already exists'});
        console.log('Sign already exists');
        decision=false;
      }
    }
    if (this.state.newHubSign.length<=5 && decision) {
    await new window.web3.eth.Contract(nexyohub.abi).deploy({
      data: nexyohub.bytecode, arguments: [this.state.newHubName,this.state.newHubSign,this.state.Taddress]}).send({
        from:this.state.Uaccount});
    } else {
      this.setState({newHubSign:'Sign to long'});
      console.log('Sign is to long. Please use less than 6 Symbols');
    }
    this.loadBlockchainData().then((e) => {
      this.dropcreateHub(e);
    });
  }

  deploy_datacricle = async (e) => {
    e.preventDefault();
    await this.setState({finished: false});
    await new window.web3.eth.Contract(nexyocircle.abi).deploy({
      data: nexyocircle.bytecode, arguments: [this.state.ContractName,this.state.newCircleName,this.state.Taddress]}).send({
        from:this.state.Uaccount});
    this.loadBlockchainData().then((e) => {
      this.dropnewDataCircle(e);
    });
  }

  selectHub = async(e,add) => {
    await this.setState({finished: false});
    await this.setState({SelectedHub: add});
    console.log('Hub ',this.state.SelectedHub,' was chosen');
    this.loadBlockchainData();
  }

  findaddress = (name) => {
    let x=0;
    for (x=0; x<this.state.Hubs.length; x++) {
      if (this.state.Hubs[x][3]===name && this.state.Caddress!==this.state.Hubs[x][0]) {
        console.log(this.state.Hubs[x][0]);
        return this.state.Hubs[x][0]
      }
    }
  }

  doyouownPointer = async (pointer) => {
    let answer= await this.state.Hub.methods.doyouownPointer(pointer).call({from:this.state.Uaccount});
    console.log("do you own",pointer,answer);
    this.loadBlockchainData();
  }

  buytoken = async (e, id) => {
    console.log('Let me see some ID:',id);
    await this.setState({finished: false});
    let price=await this.state.Hub.methods.priceOf(id).call();
    await this.state.Hub.methods.buy(id).send({from:this.state.Uaccount,value:price.toString()});
    this.setState({finished: true});
    console.log('bought');
    this.loadBlockchainData();
  };

  selltoken = async (e, id) => {
    console.log('Let me see some ID:',id);
    this.setState({finished: false});
    await this.state.Hub.methods.sell(id).send({from:this.state.Uaccount});
    this.setState({finished: true});
    console.log('sold');
    this.loadBlockchainData();
  }

  mint = async (e,pointer) => {
    await this.setState({finished: false});
    await this.doyouownPointer(pointer);
    await this.state.Hub.methods.mint(pointer).send({from:this.state.Uaccount})
    console.log(pointer);
    await this.setState({finished: true})
    this.loadBlockchainData();
  }

  makePointer =async (e,string) => {
    this.setState({finished: false});
    let result= await this.state.Hub.methods.isPointerthere(string).call()
    if(result===false){
      await this.state.Hub.methods.makePointer(string).send({from:this.state.Uaccount.toString()})
    }
    else {console.log('Pointer already exists with the contract');}
    this.setState({finished: true});
    this.loadBlockchainData();
    return result;
  }

  approvePointers = async (e,pointers) => {
    this.setState({finished: false});
    console.log(pointers)
    await this.state.Hub.methods.approvePointers(pointers).send({from:this.state.Uaccount.toString()});
    this.setState({finished: true});
    this.loadBlockchainData();
  }

  revokePointers = async (e,pointers) => {
    this.setState({finished: false});
    console.log('Pointers',pointers)
    await this.state.Hub.methods.revokePointers(pointers).send({from:this.state.Uaccount.toString()});
    this.setState({finished: true});
    this.loadBlockchainData();
  }

  applyforDataOwner = (e,address) => {
    this.setState({finished: false});
    e.preventDefault();
    this.setState({finished: true});
  }

  addDataOwner = async (e,address) => {
    this.setState({finished: false});
    let result= await this.state.Hub.methods.isDataOwnerthere(address).call()
    if(result===false){
      await this.state.Hub.methods.addDataOwner(address).send({from:this.state.Uaccount.toString()});
    }
    else {console.log('User already is Data Owner')}
    this.setState({finished: true});
    this.loadBlockchainData();
    return result
  }

  mintwithOptions = async (e,sub,res,dat,sell) => {
    this.setState({finished: false});
    dat=dat*86400
    console.log(sub,res,dat)
    await this.state.Hub.methods.mintwithOptions(sub,res,dat,sell).send({from:this.state.Uaccount.toString()});
    this.loadBlockchainData();
  }

  mintto = async (e,add,pointer,time) => {
    this.setState({finished: false});
    let dat=time*86400
    console.log(add,pointer,time)
    await this.state.Hub.methods.mint_to(add,pointer,dat).send({from:this.state.Uaccount.toString()});
    this.loadBlockchainData();
  }

  dropcreateHub = (e) => {
    if (typeof e !== 'undefined') {e.preventDefault();} //this is a work around. loadBlockchainData really should have Errorhandling!
    let inverse=!this.state.createHubMenu;
    this.setState({newDataCircleMenu:false})
    this.setState({createHubMenu:inverse});
  }

  dropnewDataCircle = (e) => {
    if (typeof e !== 'undefined') {e.preventDefault();} //this is a work around. loadBlockchainData really should have Errorhandling!
    let inverse=!this.state.newDataCircleMenu;
    this.setState({createHubMenu:false});
    this.setState({newDataCircleMenu:inverse});
  }

  handleCircles = (e) => {
    e.preventDefault();
    let circle=!this.state.showCircles;
    this.setState({showCircles:circle});
    console.log(circle);
  }

  selectcircle = async (e) => {
    e.preventDefault();
    await this.setState({SelectedCircle:e.target.value})
    this.circletokens()
  }

  addcircleuser = async (e,user) => {
    e.preventDefault();
    this.setState({finished: false});
    await this.state.addCircleUser(user,3).send({from:this.state.Uaccount});
    this.setState({finished: true});
  }

  destroycircle = async (e) => {
    e.preventDefault();
    this.setState({finished: false});
    await this.state.DestroyCircle().send({from:this.state.Uaccount});
    this.loadBlockchainData();
  }

  componentWillMount() {
    this.loadConnection().then(() => {
    this.loadBlockchainData()});
    }

  render() {
    let MainContent= <Main
      mint={this.mint}
      mintto={this.mintto}
      Pointers={this.state.Pointers}
      makePointer={this.makePointer}
      PointerstoApprove={this.state.PointerstoApprove}
      approvePointers={this.approvePointers}
      revokePointers={this.revokePointers}
      addDataOwner={this.addDataOwner}
      mintwithOptions={this.mintwithOptions}/>

      let MainContent2= <DataOwner
        mint={this.mint}
        mintto={this.mintto}
        Pointers={this.state.Pointers}
        makePointer={this.makePointer}
        mintwithOptions={this.mintwithOptions}/>

      let Nav= <NavBar
        Uaccount={this.state.Uaccount}
        Ubalance={this.state.Ubalance}
        UNFTbalance={this.state.UNFTbalance}
        CircleBalance={this.state.CircleBalance}
        Oaddress={this.state.Oaddress}
        Caddress={this.state.Caddress}
        HubName={this.state.HubName}
        Hubs={this.state.Hubs}
        selectHub={this.selectHub}
        ContractName={this.state.ContractName}
        showCircles={this.state.showCircles}
        handleCircles={this.handleCircles}/>

    return(
      <div className='flex h-screen w-full h-full fixed block top-0 left-0'>
        <div className='relative m-auto z-30'>
          {this.state.MyHubs.length>0 ?
            <div className='border-black border-t border-r border-l rounded-t-lg shadow'>
              <span className='px-1'>My Hubs:</span>
              {this.state.MyHubs.map((hub,index) =>
                this.state.HubName===hub ?
                  <button className='border boder-black rounded-t-lg px-1 focus:outline-none bg-indigo-400 text-white'>{hub}</button> :
                    <button className='truncate hover:bg-clip-border hover:border hover:boder-black rounded-t-lg px-1 focus:outline-none hover:bg-indigo-400 hover:text-white' onClick={(e) => this.selectHub(e,this.findaddress(hub))}>{hub}</button>
              )}
            </div> :<div></div>
          }
          <div className='pv-2 border-black border-t border-r border-l'>
            {Nav}
            {this.state.finished ?
              <div className='flex flex-col'>
                <div className="flex justify-center">
                  {this.state.OwnerPresent ? MainContent : this.state.DataOwnerPresent ? MainContent2 : <div></div>}
                </div>
                <div className="py-2 flex justify-center flex-col">
                  <Tokens
                    MyTokens={this.state.MyTokens}
                    resttoken={this.resttoken}
                    selltoken={this.selltoken}
                    Pointers={this.state.Pointers}/>
                  <Buyables buyable={this.state.buyable} buytoken={this.buytoken}/>
                </div>
                <div className="py-2 flex justify-center flex-col">
                  <Circle
                    resttoken={this.resttoken}
                    showCircles={this.state.showCircles}
                    MyCircles={this.state.MyCircles}
                    MyCircleTokens={this.state.MyCircleTokens}
                    SelectedCircle={this.state.SelectedCircle}
                    selectcircle={this.selectcircle}
                    addcircleuser={this.addcircleuser}
                    destroycircle={this.destroycircle}
                    CircleChief={this.state.CircleChief}/>
                </div>
              </div>
            :
              <div className='flex justify-center'>
                <Loader type="Hearts" color="#00BFFF" height={180} width={180} />
              </div>
          }
          </div>
          <div className='border-b border-r border-l border-black rounded-b-lg shadow'>
            <table className='w-full'>
              <tbody>
                <tr>
                  <td>
                    {!this.state.createHubMenu ?
                      <button className='hover:bg-clip-border hover:border hover:boder-black rounded-bl-lg rounded-tr-lg px-1 focus:outline-none hover:bg-indigo-400 hover:text-white' onClick={(e) => this.dropcreateHub(e)}>Create new Hub</button> :
                      <button className='rounded-t-lg px-1 focus:outline-none bg-indigo-400 text-white' onClick={(e) => this.dropcreateHub(e)}>Create new Hub</button>
                    }
                  </td>
                  <td>
                    <p className='text-right'>
                      {!this.state.newDataCircleMenu ?
                        <button className='text-right truncate hover:bg-clip-border hover:border hover: boder-black rounded-br-lg rounded-tl-lg px-1 focus:outline-none hover:bg-indigo-400 hover:text-white' onClick={(e) => this.dropnewDataCircle(e)}>Create new Data-Cricle</button> :
                        <button className='rounded-t-lg px-1 focus:outline-none bg-indigo-400 text-white' onClick={(e) => this.dropnewDataCircle(e)}>Create new Data-Cricle</button>
                      }
                    </p>
                  </td>
                </tr>
                <tr>
                  { this.state.createHubMenu ?
                    <td className='border-t-2 border-r-2 rounded-tl-lg border-indigo-400'>
                      <div>
                        <form className='m-2'>
                          <label>Network: <input className='rounded-lg bg-gray-200 focus:bg-white w-32 px-4' type='text' placeholder="Name" value={this.state.newHubName} onChange={(e) => this.setState({newHubName:e.target.value})}/></label>
                          <label>Sign: <input className='rounded-lg bg-gray-200 focus:bg-white w-32 px-4' type='text' placeholder="Sign" value={this.state.newHubSign}  onChange={(e) => this.setState({newHubSign:e.target.value.toUpperCase()})}/></label>
                          <button className='rounded-lg px-2 hover:bg-green-400 hover:text-white' type='submit' onClick={(e) => this.deploy_nexyohub(e)}>Create</button>
                        </form>
                      </div>
                    </td>: <td></td>
                    }
                    { this.state.newDataCircleMenu ?
                      <td className='text-right border-t-2 border-l-2 rounded-tl-lg border-indigo-400'>
                          <form className='m-2'>
                            <label>Name: <input className='rounded-lg bg-gray-200 focus:bg-white w-32 px-4' type='text' placeholder="Sign" value={this.state.newCircleName}  onChange={(e) => this.setState({newCircleName:e.target.value.toUpperCase()})}/></label>
                            <button className='rounded-lg hover:bg-green-400 hover:text-white px-2' type='submit' onClick={(e) => this.deploy_datacricle(e)}>Create</button>
                          </form>
                    </td> : <td></td>
                    }
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center"><a className='text-red-500' href="https://www.nexyo.io">Nexyo.io</a></div>
        </div>
      </div>
    )
  }
}
export default App;
