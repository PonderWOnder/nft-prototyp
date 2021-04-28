import React,{Component} from 'react';

class Buyables extends Component {

  getDate = (posix) => {
    return (posix/86400).toString().substring(0,6)+' Days'
  }

  render() {
    return (
      <div>
        {this.props.buyable.length>0 ?
          <div className='text-center mt-3'>
            <p>Offers</p>
            {this.props.buyable.map((token,index) =>
              <p className='mt-2'>
                <span>  {token[0]} </span>
                <span className='truncate'>  {token[1]} </span>
                <span>  {token[2]} </span>
                <span>  {window.web3.utils.fromWei(token[3].toString(), 'ether').substring(0,6)} ETH </span>
                <button className='rounded-lg hover:bg-green-400 hover:text-white px-2' onClick={e => this.props.buytoken(e, token[0])}>
                  <span>  Buy </span>
                </button>
                <div>
                  {!token[4] ? <span> Resellable </span> : <span> No Resell </span>}
                  {token[5]!=='0' ? <span> {this.getDate(token[5])} </span> : <span> No Timelimit </span>}
                </div>
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
