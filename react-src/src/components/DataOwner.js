import React,{Component} from 'react'
import Cred from './cred_card'
import Mint from './Mint'

class DataOwner extends Component {

  constructor(props) {
    super(props);
    this.state={
      submit:'',
      window:false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({submit: e.target.value})
    console.log(this.state.submit)
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({submit: e.target.value}, () => {
    console.log(this.state.submit)})
  }

  handleMenu = (e) => {
    e.preventDefault();
    let new_state=!this.state.window;
    this.setState({window: new_state});

  }

  render() {
    return(
      <div>
        <div className='flex item-center'>
          <div>
            <form onSubmit={(e) => this.handleChange(e)}>
              <label className=''> Pointer
                <input className='rounded-lg bg-gray-200 focus:bg-white w-32 px-4' type='text' placeholder='new Pointer' onChange={(e) => this.handleChange(e)}/>
              </label>
            </form>
          </div>
          <div>
            <button className='rounded-lg px-4 hover:bg-green-400 hover:text-white' onClick={e => this.handleMenu(e)}>Create</button>
          </div>
          <div>
            {this.state.window ? <Cred Pointer={this.state.submit} makePointer={this.props.makePointer} Menu={this.handleMenu}/> : <div></div>}
          </div>
        </div>
        <div className='flex item-center grid-cols-2'>
          <div>
            <Mint mint={this.props.mint} mintto={this.props.mintto} mintwithOptions={this.props.mintwithOptions} Pointers={this.props.Pointers}/>
          </div>
        </div>
      </div>
    );
  }
}


export default DataOwner;
