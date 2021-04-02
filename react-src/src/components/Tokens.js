import React,{Component} from 'react';

class Tokens extends Component {
  render() {
    return (
      <div className='tokens'>
        <div>My Tokens</div>
        <table>
          <tbody>
            {this.props.MyTokens.map((token,index) =>
                <tr key={index}>
                  <td>  {token[0]} </td>
                  <td>  {token[1]}  </td>
                  <td>  {token[2]}  </td>
                  <td>
                    <button onClick={e => this.props.resttoken(e, token[1]+token[2],token[1],token[0])}>
                      Connect
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
export default Tokens
