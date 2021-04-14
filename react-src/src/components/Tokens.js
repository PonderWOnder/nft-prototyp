import React,{Component} from 'react';

class Tokens extends Component {
  render() {
    return (
      <div className='text-center mt-2'>
        <p>My Tokens</p>
        {this.props.MyTokens.map((token,index) =>
          <p>
            <span>  {token[0]} </span>
            <span className='truncate'>  {token[1]} </span>
            <span>  {token[2]} </span>
            <button className='hover:bg-indigo-400 hover:text-white' onClick={e => this.props.resttoken(e, token[1]+token[2],token[1],token[0])}>
              <span>  Connect </span>
            </button>
          </p>
          )}
      </div>
    );
  }
}
export default Tokens
