import React,{Component} from 'react'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state={
      submit:null,
      approvables:[],
      close:'-'
    }
  }

  handleCheckSubmit = async (e) => {
    console.log(e.target.value)
    let des=this.state.approvables.some(item => item===e.target.value);
    if(des===false) {
      let newarray=this.state.approvables.concat(e.target.value);
      await this.setState({approvables: newarray})
    }else {
      let newarray=this.state.approvables;
      await this.setState({approvables: newarray.filter(pointer => pointer !== e.target.value)})
    }
    await console.log('Approvables',des,this.state.approvables,e.target.value);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({submit: e.target.value})
    console.log(this.state.submit)
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

  render() {
    return(
      <div className='text-center'>
        <div className='flex item-center'>
          <div>
            <form onSubmit={(e) => this.handleChange(e)}>
              <label> Create Pointer
                <input className='rounded-lg bg-gray-200 focus:bg-white w-32 px-4' type='text' placeholder='new Pointer' onChange={(e) => this.handleChange(e)}/>
              </label>
            </form>
          </div>
          <div>
            <button className='rounded-lg px-4 hover:bg-green-400 hover:text-white' onClick={e => this.props.makePointer(e,this.state.submit)}>Submit</button>
          </div>
        </div>
        <div className='flex item-center mt-2'>
          <form onSubmit={(e) => this.handleChange(e)}>
            <label> Add Data Owner
              <input className='rounded-lg bg-gray-200 focus:bg-white w-40 px-4' type='text' placeholder='new Data Owner' onChange={(e) => this.handleChange(e)}/>
            </label>
          </form>
          <button className='rounded-lg px-4 hover:bg-green-400 hover:text-white' onClick={e => this.props.addDataOwner(e,this.state.submit)}>Add</button>
        </div>
        <div className='flex item-center mt-2'>
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
        <div className='flex item-center grid-cols-3'>
          <div>
            <button className='rounded-full p-1 hover:text-red-400 hover:bg-black' onClick={e => this.handleClose(e)}>{this.state.close}</button>
          </div>
          {this.state.close==='x' ?
            <div>
              {this.props.PointerstoApprove.length>0 ?
                <form className='mt-2'>
                  {this.props.PointerstoApprove.map((URI,index) =>
                  <label className='px-2' key={index}>{URI}<input type='checkbox' id={index} value={URI} onChange={(e) =>this.handleCheckSubmit(e)}/></label>)}
                  <button className='rounded-lg px-2 hover:bg-green-400 hover:text-white' type='submit' onClick={e => this.props.approvePointers(e,this.state.approvables)}>Approve</button>
                  <button className='rounded-lg px-2 hover:bg-red-600 hover:text-white' type='submit' onClick={e => this.props.revokePointers(e,this.state.approvables)}>Revoke</button>
                </form> : <p>Everything up to date!</p>}
            </div> :
            <div></div>
          }
        </div>
      </div>
    );
  }
}


export default Main;
