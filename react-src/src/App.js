import React,{Component} from 'react';
import './App.css';
import {MainCOwner, MainUser} from './components/Main'
import NavBar from './components/NavBar'
import Loader from './components/Loader'
import Buyables from './components/Buyables'
import Web3 from 'web3';
import nexyohub from './contracts/nexyohub.json'

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
    await this.loadConnection();
    await this.loadBlockchainData();
    }

  async loadBlockchainData() {
    const web3 = window.web3
    const account=await web3.eth.getAccounts()
    this.setState({Uaccount: account[0]})
    const networkID=await web3.eth.net.getId()
    const NexyoHub=await nexyohub.networks[networkID]
    if(NexyoHub) {
      let Hub=new web3.eth.Contract(nexyohub.abi,NexyoHub.address);
      this.setState({Hub});
      let Caddress=await Hub.methods.returnAddress().call();
      this.setState({Caddress: Caddress});
      let Oaddress=await Hub.methods.whoisOwner().call();
      let ContractName=await Hub.methods.returnContractName().call();
      this.setState({ContractName: ContractName});
      let HubName=await Hub.methods.returnContractName().call();
      this.setState({HubName: HubName});
      let Ubalance=await web3.eth.getBalance(this.state.Uaccount);
      this.setState({Ubalance: Ubalance});
      let UNFTbalance=await Hub.methods.balance().call();
      this.setState({UNFTbalance: UNFTbalance});
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
      this.setState({buyable: arr})
      if (Oaddress==this.state.Uaccount) {
        console.log('Contract owner present:', this.state.Uaccount)
        let mint=Hub.methods.mint;
        let mint_to=Hub.methods.mint_to;
        let addProvider=Hub.methods.addDataOwner;
        let makePointer=Hub.methods.makePointer;
        this.setState({OwnerPresent:true});
    }
  } else {
    window.alert('Can\'t find Contract');
  };
  this.setState({finished:true});
  };

  async loadConnection() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    }else if (window.web3) {
      window.web3=new Web3(window.web3.currentProvider)
    }
  };

  constructor(props) {
    super(props);
    this.state={
      ContractName:'Couldn\'t find Hub',
      HubName:'Couldn\'t find Hub',
      Caddress:'No Contract Connected',
      Hub:{},
      Uaccount:'No Web3 Connector passed',
      buyable: [],
      Ubalance:'0',
      UNFTbalance:'0',
      OwnerPresent:false,
      finished:false
    }
  }

  async buytoken(id) {
    this.setState({finished: false})
    let price= await this.state.Hub.price(id).call()
    await this.state.Hub.buy(id,{from:this.state.Uaccount,value:price}).call()
    this.setState({finished: true})
  }


  render() {
    let MainContent=null;
    if (this.state.finished===false) {
      MainContent=<Loader/>
    }else if (this.state.OwnerPresent===true) {
      MainContent=<MainCOwner U
        Ubalance={this.state.Ubalance}
        UNFTbalance={this.state.UNFTbalance}/>
    }
      else {
        MainContent=<MainUser
          Ubalance={this.state.Ubalance}
          UNFTbalance={this.state.UNFTbalance}/>
      }
    return(
      <div>
        <NavBar Uaccount={this.state.Uaccount}/>
        {MainContent}
        <ul>
          {this.state.buyable.map((token,index) =>
              <tr key={index}>
                <td>  {token[0]} </td>
                <td>  {token[1]}  </td>
                <td>  {token[2]}  </td>
                <td>  {window.web3.utils.fromWei(token[3].toString(), 'ether')} </td>
                <td>  ETH </td>
                <td>
                  <button
                  onCilck={(event) => {
                    event.preventDefault()
                    let id=token[0].toString()
                    this.buytoken(id)
                  }}>
                    BUY
                  </button>
                </td>
              </tr>
            )}

        </ul>
        <div>
          <nav className="Interface">
            <a className="Homebutton" href="https://www.nexyo.org">
            Nexyo.org
            </a>
          </nav>
        </div>
      </div>
      )
  }
}
export default App;
