import React,{Component} from 'react';

class Buyables extends Component {
  render() {
    return (
      <div>
        {this.props.buyable.length>0 ?
          <div className='text-center mt-2'>
            <p>Offers</p>
            {this.props.buyable.map((token,index) =>
              <p>
                <span>  {token[0]} </span>
                <span className='truncate'>  {token[1]} </span>
                <span>  {token[2]} </span>
                <span>  {window.web3.utils.fromWei(token[3].toString(), 'ether').substring(0,6)} ETH </span>
                <button className='rounded-lg hover:bg-green-400 hover:text-white px-2' onClick={e => this.props.buytoken(e, token[0])}>
                  <span>  Buy </span>
                </button>
              </p>
              )}
          </div> :
          <div></div>
        }
      </div>
    );
  }
}
export default Buyables
