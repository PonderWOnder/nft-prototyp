import React,{Component} from 'react'

class MainCOwner extends Component {
  render(){
    return(
      <div id='content' className='mt-3'>
        <table className='table table-borderless text-muted text-center'>
          <thread>
            <tr>
              <th scope='col'> ETH Balance</th>
              <th scope='col'> NXNFT Balance</th>
            </tr>
            </thread>
            <tbody>
              <tr>
              <td>{window.web3.utils.fromWei(this.props.Ubalance.toString(), 'ether')} Ether</td>
              <td>{this.props.UNFTbalance.toString()} NFT</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class MainUser extends Component {
  render(){
    return(
      <div id='content' className='mt-3'>
        <table className='table table-borderless text-muted text-center'>
          <thread>
            <tr>
              <th scope='col'> ETH Balance</th>
              <th scope='col'> NXNFT Balance</th>
            </tr>
            </thread>
            <tbody>
              <tr>
              <td>{window.web3.utils.fromWei(this.props.Ubalance.toString(), 'ether')} Ether</td>
              <td>{this.props.UNFTbalance.toString()} NFT</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export {MainCOwner, MainUser};
