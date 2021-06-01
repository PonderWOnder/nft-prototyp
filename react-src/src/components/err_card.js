import React,{Component} from 'react';

class Err extends Component {

  constructor(props) {
    super(props);
  }

  render()
  {
    return(
      <div className='flex h-screen w-full h-full fixed block top-0 left-0 bg-gray-400 bg-opacity-75 z-990'>
        <div className='relative m-auto rounded-xl p-2 bg-gray-600 z-1010'>
          <div className='flex item-right'>
            <button className='rounded-full hover:text-red-400 hover:bg-black' onClick={e => this.props.Menu(e)}>x</button>
          </div>
          <div>
            <p> The action you trying to perform is prohibited</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Err
