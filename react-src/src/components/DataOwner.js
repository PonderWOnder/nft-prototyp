import React,{Component} from 'react'
import Cred from './cred_card'
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
                <input className='rounded-xl bg-gray-200 focus:bg-white w-32 px-4' type='text' placeholder='new Pointer' onChange={(e) => this.handleChange(e)}/>
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
        <div className='flex item-center'>
          <div>
            <select defaultValue='Choose here' onChange={(e) => this.handleChange(e)} placeholder='Pointers'>
              <option selected disabled hidden>Choose here</option>
              {this.props.Pointers.map((URI,index) =>
                <option className='truncate' key={index+1} value={URI}>{URI}</option>
              )}
            </select>
          </div>
          <div>
            <button className='rounded-lg px-4 hover:bg-green-400 hover:text-white' onClick={e => this.props.mint(e,this.state.submit)}>MINT</button>
          </div>
        </div>
      </div>
    );
  }
}


export default DataOwner;
