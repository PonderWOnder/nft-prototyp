import React,{Component} from 'react';

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state={
      drop: false,
      switch: false
    }}

  handleChange = (e) => {
    e.preventDefault();
    let dropping=!this.state.drop;
    this.setState({drop: dropping});
    console.log(this.state.drop);
  }

  handleSwitch = (e) => {
    e.preventDefault();
    let dropping=!this.state.switch;
    this.setState({switch: dropping});
    console.log(this.state.switch);
  }

  render(){
    return(
      <div className='flex text-center p-4'>
        <div className='flex-1 max-w-xl p-2 rounded-xl border-2 border-grey-600'>
          <button className='focus:outline-none mt-2 rounded-lg p-1 hover:bg-indigo-400 hover:text-white' onClick={(e) => this.handleChange(e)}> Hub Name: {this.props.HubName.toString()}</button>
          {this.state.drop ?
            <div>
              <p className='truncate p-1'> Organization: {this.props.ContractName.toString()}</p>
              <p className='truncate p-0'>Contract Owner: {this.props.Oaddress.toString()}</p>
              <button className='focus:outline-none truncate rounded-lg p-1 hover:bg-indigo-400 hover:text-white' onClick={(e) => this.handleSwitch(e)}>Contract Adress: {this.props.Caddress.toString()}</button>
              {this.state.switch ?
                <div>
                  {this.props.Hubs.map((arr,index) =>
                    <button  className='focus:outline-none rounded-lg p-1 hover:bg-indigo-400 hover:text-white' onClick={(e) => this.props.selectHub(e,arr[0])}>{[arr[1],arr[2]].toString()}</button>
                  )}
                </div>:<div></div>
              }
              <p className="text-gray-500 truncate p-1"> User:{this.props.Uaccount.toString()}</p>
            </div> : <div> <p className="text-gray-500 truncate p-1"> User:{this.props.Uaccount.toString()}</p> </div>
          }
        </div>
        <div className='relative m-auto flex-1 p-2 rounded-xl border-2 border-grey-600'>
          <div className='mt-2 rounded-xl p-1'>
            <p> ETH Balance</p>
            <p>{window.web3.utils.fromWei(this.props.Ubalance.toString(), 'ether').substring(0,6)} ETH</p>
          </div>
          <div className='mt-2'>
            <p> NFT Balance</p>
            <p>{this.props.UNFTbalance.toString()} NFT</p>
          </div>
        </div>
      </div>
    )
  }
}
export default NavBar
