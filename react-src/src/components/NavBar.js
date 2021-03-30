import React,{Component} from 'react';

class NavBar extends Component {
  render(){
    return(
      <div>
        <table>
          <tbody>
            <tr>
              <td>Hub Name: {this.props.HubName.toString()}</td>
              <td> Organization: {this.props.ContractName.toString()}</td>
            </tr><tr>
              <td>Contract Address: {this.props.Caddress.toString()}</td>
              <td> Contract Owner: {this.props.Oaddress.toString()}</td>
            </tr>
            <tr>
              <td> User:{this.props.Uaccount.toString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
export default NavBar
