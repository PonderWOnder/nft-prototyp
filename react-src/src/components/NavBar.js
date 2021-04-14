import React,{Component} from 'react';


class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state={
      drop: false}}

  handleChange = (e) => {
    e.preventDefault();
    let dropping=!this.state.drop;
    this.setState({drop: dropping}, () => {
    console.log(this.state.drop)})
  }

  render(){
    return(
      <div className='flex text-center p-4'>
        <div className='flex-1 max-w-xl mt-2 rounded-xl border-2 border-grey-600'>
          <button className='mt-2 rounded-xl p-1 hover:bg-indigo-400 hover:text-white' onClick={(e) => this.handleChange(e)}> Hub Name: {this.props.HubName.toString()}</button>
          <p className='truncate p-1'> Organization: {this.props.ContractName.toString()}</p>
          <p className='truncate p-0'>Contract Address: {this.props.Caddress.toString()}</p>
          <p className='truncate p-0'>Contract Owner: {this.props.Oaddress.toString()}</p>
          <p className="text-gray-500 truncate p-1"> User:{this.props.Uaccount.toString()}</p>
        </div>
        <div className='flex-1 mt-2 rounded-xl border-2 border-grey-600'>
          <div className='mt-2 rounded-xl p-1'>
            <p> ETH Balance</p>
            <p>{window.web3.utils.fromWei(this.props.Ubalance.toString(), 'ether').substring(0,6)} ETH</p>
          </div>
          <div className='mt-2'>
            <p> NXNFT Balance</p>
            <p>{this.props.UNFTbalance.toString()} NFT</p>
          </div>
        </div>
      </div>
    )
  }
}
export default NavBar
