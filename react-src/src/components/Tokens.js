import React,{Component} from 'react';

class Tokens extends Component {

  constructor(props) {
    super(props);
    this.state={
      time: '0',
      close:'-'
    }
  }

  clock = (timer) => {
    let time=timer-Math.floor(new Date().getTime()/1000.0)
    let seconds=time%60;
    let retstr=seconds.toString()+' Sec'
    if (time>60) {
      let minutes=Math.floor(time/60)%(60)
      retstr=minutes.toString()+' Min '+retstr
      if (time>(60*60)) {
        let hours= Math.floor(time/3600)%(24)
        retstr=hours.toString()+' Hours '+retstr
        if (time>(24*60*60)) {
          let days=Math.floor(time/(24*3600))
          retstr=days.toString()+' Days '+retstr
        }
      }
    }
    return retstr
  }


  sellable = (sell,resell,pointer) => {
    let result=true;
    if (resell) {
      if (this.props.Pointers.includes(pointer)) {
        result=true;
      } else {
        result=false;
      }
    }
    console.log(pointer,resell,sell, result,'=',result === !sell );
    return  result === !sell
  }

  render() {
    return (
      <div>
        {this.props.MyTokens.length>0 ?
          <div className='text-center mt-2'>
            <p>My Tokens</p>
            {this.props.MyTokens.map((token,index) =>
              <div key={index}>
                <span>  {token[0]} </span>
                <span className='truncate'>  {token[1]} </span>
                <span>  {token[2]} </span>
                {(token[6] > Math.floor(new Date().getTime()/1000) || token[6]==='0') ? //need to do some type conversion to make this rock solid!
                  <button className='rounded-lg hover:bg-indigo-400 hover:text-white px-2' onClick={e => this.props.resttoken(e, token[1]+token[2],token[1],token[0])}> <span>  Connect </span> </button>:
                  <button className='rounded-lg text-gray-400 px-2'><span>  Connect </span></button>
                }
                {this.sellable(token[4],token[5],token[2]) ?
                  <button className='rounded-lg hover:bg-red-600 hover:text-white px-2' onClick={e => this.props.selltoken(e, token[0])}><span>  Sell </span></button> :
                  <button className='rounded-lg text-gray-400 px-2'><span>  Sell </span></button>
                }
                {(token[6]-Math.floor(new Date().getTime()/1000.0))>0 ? <div><span>Expiring in {this.clock(token[6])}</span></div> : <div/>}
              </div>
              )}
          </div>:
          <div></div>
        }
      </div>
    );
  }
}
export default Tokens
