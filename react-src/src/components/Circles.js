import React,{Component} from 'react';

class Circle extends Component {

  constructor(props) {
    super(props);
    this.state={
      User:''
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

  render() {
    return (
     <div className='m-2'>
        {this.props.showCircles ?
          <div className='text-left'>
            <span className='pr-2'> My Circles:</span>
            <select value={this.state.choice} onChange={(e) => this.props.selectcircle(e)}>
              <option selected disabled hidden>Choose here</option>
              {this.props.MyCircles.map((CIRC,index) =>
                <option key={index+1} value={CIRC}>{CIRC}</option>
              )}
            </select>
            { this.props.CircleChief ?
              <span className='pr-2'> <span className='pr-2'/>
              <input className='rounded-lg bg-gray-200 focus:bg-white w-32 px-4' type='text' placeholder='0x...' onChange={(e) => this.setState({User:e.target.value})}/>
              <button className='rounded-lg px-4 hover:bg-green-400 hover:text-white' onClick={(e) => this.props.addcircleuser(e,this.state.User)}>Add User</button>
              <button className='rounded-lg hover:bg-red-600 hover:text-white px-2' onClick={(e) => this.props.destroycircle(e)}>Delet Circle</button></span> :
              <p/>
            }
            {this.props.MyCircleTokens.map((token,index) =>
              <div key={index}>
                <span>  {token[0]} </span>
                <span className='truncate'>  {token[1]} </span>
                <span>  {token[2]} </span>
                {(token[6] > Math.floor(new Date().getTime()/1000) || token[6]==='0') ? //need to do some type conversion to make this rock solid!(e,msg,add,id,cadd)
                  <button className='rounded-lg hover:bg-indigo-400 hover:text-white px-2' onClick={e => this.props.resttoken(e, token[1]+token[2],token[0],token[7])}> <span>  Connect </span> </button>:
                  <button className='rounded-lg text-gray-400 px-2'><span>  Connect </span></button>
                }
                {(token[6]-Math.floor(new Date().getTime()/1000.0))>0 ? <div className='text-center'><span>Expiring in {this.clock(token[6])}</span></div> : <div/>}
              </div>
            )}
          </div>: <div></div>
        }
      </div>
    )
  }
}
export default Circle
