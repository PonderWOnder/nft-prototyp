import React,{Component} from 'react';
import './App.css'
import "tailwindcss/tailwind.css"
import Main from './components/Main'
import DataOwner from './components/DataOwner'
import NavBar from './components/NavBar'
import Buyables from './components/Buyables'
import Tokens from './components/Tokens'
import Cred from './components/cred_card'
import nexyohub from './contracts/nexyohub.json'
import Web3 from 'web3';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

//const Web3 = require("web3");

const getWeb3 = () =>
  new Promise((resolve,reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const web3=new Web3(window.ethereum);
        try{
          await window.ethereum.enable();
          resolve(web3);
        } catch (error){
          reject(error);
        }
      }
      else if(window.web3) {
        const web3=window.web3;
        console.log('Web3 Object Injetction detected');
        resolve(web3);
      }
      else{
        const provider=new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        const web3=new Web3(provider);
        console.log('No Injector found using fallback address localhost');
        resolve(web3);
      }
    });
  });



class App extends Component {

  async loadBlockchainData() {
    const web3 = window.web3
    const account=await web3.eth.getAccounts()
    this.setState({Uaccount: account[0]})
    const networkID=await web3.eth.net.getId()
    const NexyoHub=await nexyohub.networks[networkID]
    if(NexyoHub) {

      let Hub=new web3.eth.Contract(nexyohub.abi,NexyoHub.address);
      this.setState({Hub: Hub});

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
      for (var i=0; i<len;i++){
        let id=buyableArray[i];
        var newline=[id,
          await Hub.methods.ownerOf(id).call(),
          await Hub.methods.pointerOf(id).call(),
          await Hub.methods.priceOf(id).call()
        ];
        arr.push(newline);
        }
      console.log('Buyable Stuff', arr);
      this.setState({buyable: arr});

      let Pointers=await Hub.methods.useablePointers().call(); //This should be done in contract
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
        this.setState({OwnerPresent:true});}

      let PointerstoApprove=await Hub.methods.PointerstoApprove().call();
      console.log('Pointers to approve', PointerstoApprove);
      this.setState({PointerstoApprove: PointerstoApprove});

      let myTokens=await Hub.methods.myTokens(account[0]).call();
      let UNFTbalance=myTokens.length;
      let MyTokens=[]
      for (i=0; i<UNFTbalance;i++){
        let id=myTokens[i];
        newline=[id,
          await Hub.methods.ownerOf(id).call(),
          await Hub.methods.pointerOf(id).call(),
          await Hub.methods.priceOf(id).call(),
          await Hub.methods.tokensellable(id).call()
        ];
        MyTokens.push(newline);
      }
      console.log('My Tokens', MyTokens);
      this.setState({MyTokens: MyTokens});
      this.setState({UNFTbalance: UNFTbalance});

    } else {
      window.alert('Can\'t find Contract');
    };
    this.setState({finished:true});
    };

  async loadConnection() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }else {
      window.web3=new Web3(window.web3.currentProvider)
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
      Uaccount:'No Web3 Connector passed',
      buyable:[],
      Ubalance:'0',
      UNFTbalance:'0',
      MyTokens:[],
      Pointers:[],
      PointerstoApprove:[],
      OwnerPresent:false,
      DataOwnerPresent:false,
      finished:false
    }
  }

  next_token = async () => {
    return await this.state.Hub.methods.nextPointerid().call();
  }

  resttoken = async (e,msg,add,id) => {
    await this.setState({finished: false});
    msg=msg.substring(2);
    console.log(msg);
    let hash=await window.web3.utils.sha3(msg);
    console.log(hash);
    let hmsg= await window.web3.eth.sign(hash,add);
    console.log(hmsg);
    const apicall=hash+id+hmsg;
    console.log(apicall);
    window.open('http://localhost:8090/verify/'+apicall,'Data','height=640,width=480');
    await this.setState({finished: true});
  }

  doyouownPointer = async (pointer) => {
    let answer= await this.state.Hub.methods.doyouownPointer(pointer).call();
    console.log("do you own",pointer,answer);
    this.loadBlockchainData();
  }

  buytoken = async (e, id) => {
    console.log('Let me see some ID:',id);
    await this.setState({finished: false});
    let price=await this.state.Hub.methods.priceOf(id).call();
    await this.state.Hub.methods.buy(id).send({from:this.state.Uaccount.toString(),value:price.toString()});
    this.setState({finished: true});
    console.log('bought');
    this.loadBlockchainData();
  };

  selltoken = async (e, id) => {
    console.log('Let me see some ID:',id);
    this.setState({finished: false});
    await this.state.Hub.methods.sell(id).send({from:this.state.Uaccount.toString()});
    this.setState({finished: true});
    console.log('sold');
    this.loadBlockchainData();
  }

  mint = async (e,pointer) => {
    await this.setState({finished: false});
    await this.doyouownPointer(pointer);
    await this.state.Hub.methods.mint(pointer).send({from:this.state.Uaccount.toString()})
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

  applyforDataOwner =(e,address) => {
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

  componentWillMount() {
    this.loadConnection().then(() => {
    this.loadBlockchainData()});
    }

  render() {
    let MainContent= <Main
      mint={this.mint}
      Pointers={this.state.Pointers}
      makePointer={this.makePointer}
      PointerstoApprove={this.state.PointerstoApprove}
      approvePointers={this.approvePointers}
      revokePointers={this.revokePointers}
      addDataOwner={this.addDataOwner}/>

      let MainContent2= <DataOwner
        mint={this.mint}
        Pointers={this.state.Pointers}
        makePointer={this.makePointer}/>

      let Nav= <NavBar
        Uaccount={this.state.Uaccount}
        Ubalance={this.state.Ubalance}
        UNFTbalance={this.state.UNFTbalance}
        Oaddress={this.state.Oaddress}
        Caddress={this.state.Caddress}
        HubName={this.state.HubName}
        ContractName={this.state.ContractName}/>

    return(
      <div className='flex h-screen w-full h-full fixed block top-0 left-0'>
        <div className='relative m-auto relative rounded-xl shadow z-30'>
          {Nav}
          {this.state.finished ?
            <div className='flex flex-col'>
              <div className="flex justify-center">
                {this.state.OwnerPresent ? MainContent : this.state.DataOwnerPresent ? MainContent2 : <div></div>}
              </div>
              <div className="flex justify-center flex-col">
                <Tokens MyTokens={this.state.MyTokens} resttoken={this.resttoken} selltoken={this.selltoken}/>
                <Buyables buyable={this.state.buyable} buytoken={this.buytoken}/>
                <div className="text-center"><a className='text-red-500' href="https://www.nexyo.org">Nexyo.org</a></div>
              </div>
            </div>
          :
            <div className='flex justify-center'>
              <Loader type="Hearts" color="#00BFFF" height={180} width={180} />
            </div>
        }
        </div>
      </div>
    )
  }
}
export default App;
