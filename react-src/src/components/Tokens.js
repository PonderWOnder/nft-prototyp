import React,{Component} from 'react';

class Tokens extends Component {
  render() {
    return (
      <div>
        {this.props.MyTokens.length>0 ?
          <div className='text-center mt-2'>
            <p>My Tokens</p>
            {this.props.MyTokens.map((token,index) =>
              <p>
                <span>  {token[0]} </span>
                <span className='truncate'>  {token[1]} </span>
                <span>  {token[2]} </span>
                <button className='rounded-lg hover:bg-indigo-400 hover:text-white px-2' onClick={e => this.props.resttoken(e, token[1]+token[2],token[1],token[0])}>
                  <span>  Connect </span>
                </button>
                {!token[4] ?
                  <button className='rounded-lg hover:bg-red-600 hover:text-white px-2' onClick={e => this.props.selltoken(e, token[0])}><span>  Sell </span></button> :
                  <button className='rounded-lg text-gray-400 px-2'><span>  Sell </span></button>
                }
              </p>
              )}
          </div>:
          <div></div>
        }
      </div>
    );
  }
}
export default Tokens
