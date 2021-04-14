import React,{Component} from 'react'

class DataOwner extends Component {

  constructor(props) {
    super(props);
    this.state={
      submit:null
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

  render() {
    return(
      <div>
        <div className='flex item-center'>
          <div>
            <form onSubmit={(e) => this.handleChange(e)}>
              <label> Create Pointer
                <input className='w-32 px-4' type='text' placeholder='new Pointer' onChange={(e) => this.handleChange(e)}/>
              </label>
            </form>
          </div>
          <div>
            <button className='px-4 hover:bg-green-400 hover:text-white' onClick={e => this.props.makePointer(e,this.state.submit)}>Submit</button>
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
            <button className='px-4 hover:bg-green-400 hover:text-white' onClick={e => this.props.mint(e,this.state.submit)}>MINT</button>
          </div>
        </div>
      </div>
    );
  }
}


export default DataOwner;
