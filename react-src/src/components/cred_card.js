import React,{Component} from 'react';

class Cred extends Component {
  constructor(props) {
    super(props);
    this.state={
      pointer:this.props.Pointer,
      us:null,
      pw:null
    }
  }

  postData= async () => {
    const payload={ 'URI': this.state.pointer, 'User':this.state.us, 'PW':this.state.pw};
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    return requestOptions
  }

  send = async (e) => {
    await this.props.makePointer(e,this.state.pointer)
    let response=await fetch('http://localhost:8090/apply', this.postData());
    console.log('Response', response)
  };

  render()
  {
    return(
      <div className='flex h-screen w-full h-full fixed block top-0 left-0 bg-gray-400 opacity-75 z-50'>
        <div className='relative m-auto rounded-xl p-2 bg-gray-600 opacity-100 z-101'>
          <div className='flex item-right'>
            <button className='rounded-full hover:text-red-400 hover:bg-black' onClick={e => this.props.Menu(e)}>x</button>
          </div>
          <div className='m-auto flex item-center p-8 z-101'>
            <form>
              <input className='rounded-xl bg-gray-200 focus:bg-white w-40 px-4' type='text' value={this.state.pointer} placeholder={this.state.pointer==='' ? 'new Pointer': this.state.pointer} onSubmit={(e) => this.setState({pointer: e.target.value})}/>
              <input className='rounded-xl bg-gray-200 focus:bg-white w-40 px-4' type='text' placeholder='Username' onSubmit={(e) => this.setState({us: e.target.value})}/>
              <input className='rounded-xl bg-gray-200 focus:bg-white w-40 px-4' type='text' placeholder='Password' onSubmit={(e) => this.setState({pw: e.target.value})}/>
            </form>
          </div>
          <div>
            <button className='rounded-l px-4 hover:bg-green-400 hover:text-white' onClick={e => this.send(e)}>Submit</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Cred
