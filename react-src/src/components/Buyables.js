import React,{Component} from 'react';

class Buyables extends Component {
  render() {
    return (
      <div className='tokens'>
        <div>Buyable Tokens</div>
        <table>
          <tbody>
            {this.props.buyable.map((token,index) =>
                <tr key={index}>
                  <td>  {index} </td>
                  <td>  {token[1]}  </td>
                  <td>  {token[2]}  </td>
                  <td>  {window.web3.utils.fromWei(token[3].toString(), 'ether')} </td>
                  <td>  ETH </td>
                  <td>
                    <button onClick={e => this.props.buytoken(e, token[0])}>
                      BUY
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    );
  }
}
export default Buyables
