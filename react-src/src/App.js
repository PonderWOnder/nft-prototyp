import React,{Component} from 'react';
import './App.css';
import Main from './components/Main'
import NavBar from './components/NavBar'
import Buyables from './components/Buyables'
import Tokens from './components/Tokens'
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

  async componentWillMount() {
    this.loadConnection().then(() => {
    this.loadBlockchainData()});
    }

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
      console.log(Oaddress);
      let ContractName=await Hub.methods.returnContractName().call();
      this.setState({ContractName: ContractName});
      let HubName=await Hub.methods.returnSign().call();
      this.setState({HubName: HubName});
      let Ubalance=await web3.eth.getBalance(this.state.Uaccount);
      this.setState({Ubalance: Ubalance});

      let buyableArray=await Hub.methods.buyableTokens().call();
      var len=buyableArray.length;
      let arr=[]
      for (var i=0; i<len;i++){
        let id=buyableArray[i];
        var newline=[id,
          await Hub.methods.ownerOf(id).call(),
          await Hub.methods.pointerOf(id).call(),
          await Hub.methods.price(id).call()
        ];
        arr.push(newline);
        }
      console.log('Buyable Stuff', arr);
      this.setState({buyable: arr});

      let Pointers=await await Hub.methods.useablePointers().call();
      this.setState({Pointers: Pointers});
      console.log('Pointer',Pointers);
      if (Oaddress===this.state.Uaccount) {
        console.log('Contract owner present:', this.state.Uaccount);
        let mint=Hub.methods.mint;
        let mint_to=Hub.methods.mint_to;
        let addProvider=Hub.methods.addDataOwner;
        let makePointer=Hub.methods.makePointer;
        this.setState({OwnerPresent:true});}

      let myTokens=await Hub.methods.myTokens(account[0]).call();
      let UNFTbalance=myTokens.length;
      let MyTokens=[]
      for (i=0; i<UNFTbalance;i++){
        let id=myTokens[i];
        newline=[id,
          await Hub.methods.ownerOf(id).call(),
          await Hub.methods.pointerOf(id).call(),
          await Hub.methods.price(id).call()
        ];
        MyTokens.push(newline);
      }
      this.setState({MyTokens: MyTokens})
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
      buyable: [],
      Ubalance:'0',
      UNFTbalance:'0',
      MyTokens: [],
      Pointers: [],
      OwnerPresent:false,
      finished:false
    }
  }

  resttoken = async (e,msg,id) => {
    e.preventDefault();
    let hash=await window.web3.utils.sha3(msg);
    console.log(hash);
    let hmsg= await window.web3.eth.sign(hash,id)
    console.log(hmsg);
    return hash, hmsg;
  }

  buytoken = (e, id) => {
    e.preventDefault();
    console.log('Let me see some ID:',id);
    this.setState({finished: false});
    this.state.Hub.methods.price(id).call().then(price => {
    this.state.Hub.methods.buy(id).send({from:this.state.Uaccount.toString(),value:price.toString()})})
    this.setState({finished: true})
    console.log('bought')
  };

  mint = (e,pointer) => {
    this.setState({finished: false});
    e.preventDefault();
    this.state.Hub.methods.mint(pointer).send({from:this.state.Uaccount.toString()})
    console.log(pointer);
    this.setState({finished: true})
  }

  makePointer =(e,string) => {
    this.setState({finished: false});
    e.preventDefault();
    this.state.Hub.methods.isPointerthere(string).call().then(result => {
      if(result===false){
        this.state.Hub.methods.makePointer(string).send({from:this.state.Uaccount.toString()})
      }
      else {console.log('Pointer already exists with the contract');}
    })
    this.setState({finished: true});
  }

  render() {

    let MainContent= <Main
      OwnerPresent={this.state.OwnerPresent}
      mint={this.mint}
      Ubalance={this.state.Ubalance}
      UNFTbalance={this.state.UNFTbalance}
      Pointers={this.state.Pointers}
      makePointer={this.makePointer}/>

    return(
      <div>
          <table>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <NavBar Uaccount={this.state.Uaccount}
                          Oaddress={this.state.Oaddress}
                          Caddress={this.state.Caddress}
                          HubName={this.state.HubName}
                          ContractName={this.state.ContractName}
                          />
                  {this.state.OwnerPresent===true &&
                    <div>{this.state.finished ? MainContent : <Loader type="Hearts" color="#00BFFF" height={80} width={80} />}</div>
                  }
                  <Buyables buyable={this.state.buyable}
                            buytoken={this.buytoken}/>

                  <Tokens MyTokens={this.state.MyTokens}
                            resttoken={this.resttoken}/>

                  <a className="Homebutton" href="https://www.nexyo.org">
                  Nexyo.org
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
      )
  }
}
export default App;
