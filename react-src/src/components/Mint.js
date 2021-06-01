import React,{Component} from 'react'

class Mint extends Component {

  constructor(props) {
    super(props);
    this.state={
      submit:'Choose here',
      resell:true,
      time: '0',
      close:'-',
      minttoclose:'-'
    }
  }



  handleClose = async (e) => {
    e.preventDefault();
    if (this.state.close==='-') {
      let alternative='x';
      await this.setState({close:alternative});
    } else {
      let alternative='-';
      await this.setState({close:alternative});
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({submit: e.target.value}, () => {
    console.log(this.state.submit)})
  }

  handleCheckSubmit = (e) => {
    let inter=!this.state.resell;
    this.setState({resell: inter});
  }

  handleDaySubmit = (e) => {
    e.preventDefault();
    this.setState({time: e.target.value});
  }

  handleAddressChange = (e) => {
      e.preventDefault();
      this.setState({address: e.target.value}, () => {
      console.log(this.state.address)})
    }

  handleMintTo = (e) => {
    e.preventDefault();
    if (this.state.minttoclose==='-') {
      let alternative='x';
      this.setState({minttoclose:alternative});
    } else {
      let alternative='-';
      this.setState({minttoclose:alternative});
    }
  }

  render() {
    return(
      <div>
        <div className='flex item-center mt-2'>
          <div>
            <select value={this.state.submit} onChange={(e) => this.handleChange(e)}>
              <option selected disabled hidden>Choose here</option>
              {this.props.Pointers.map((URI,index) =>
                <option className='truncate' key={index+1} value={URI}>{URI}</option>
              )}
            </select>
          </div>
          {this.state.close!=='x' ?
            <div>
              <button className='rounded-lg px-4 hover:bg-green-400 hover:text-white' onClick={e => this.props.mint(e,this.state.submit)}>MINT</button>
              <button className='rounded-lg px-4 hover:bg-red-600 hover:text-white' onClick={e => this.handleMintTo(e)}>MINT TO</button>
            </div> : <div></div>
          }
          <div>
            <button className='rounded-full px-2 hover:text-red-400 hover:bg-black text-sm' onClick={e => this.handleClose(e)}>Options</button>
          </div>
        </div>
        <div>
          <div>
            {this.state.close==='x' ?
              <form className='mt-2'>
                <label className='px-2'> Allow Resell <input type='checkbox' checked={this.state.resell} onChange={(e) =>this.handleCheckSubmit(e)}/></label>
                <label className='px-2'> Repo Timespan in Days <input className='text-right rounded-lg bg-gray-200 focus:bg-white px-2 w-12' type='text' value={this.state.time} onChange={(e) =>this.handleDaySubmit(e)}/></label>
                <button className='rounded-lg px-4 hover:bg-green-400 hover:text-white' onClick={e => this.props.mintwithOptions(e,this.state.submit,this.state.resell,this.state.time,false)}>MINT</button>
              </form> : <div></div>
            }
          </div>
        </div>
        <div>
          <div>
            {this.state.minttoclose==='x' ?
              <form className='mt-2'>
                <label className='px-2'> Address <input className='px-2 w-32 rounded-lg bg-gray-200 focus:bg-white' placeholder='0x...' type='text' value={this.state.address} onChange={(e) =>this.handleAddressChange(e)}/></label>
                <label className='px-2'> Repo Timespan in Days <input className='text-right rounded-lg bg-gray-200 focus:bg-white px-2 w-12' type='text' value={this.state.time} onChange={(e) =>this.handleDaySubmit(e)}/></label>
                <button className='rounded-lg px-4 hover:bg-green-400 hover:text-white' onClick={e => this.props.mintto(e,this.state.address,this.state.submit,this.state.time)}>MINT</button>
              </form> : <div></div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Mint;
