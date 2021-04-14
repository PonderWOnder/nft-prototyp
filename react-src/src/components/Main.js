import React,{Component} from 'react'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state={
      submit:null,
      approvables:[]
    }
  }

  handleCheckSubmit = async (e) => {
    console.log()
    let des=this.state.approvables.some(item => item===e.target.value);
    if(des===false) {
      let newarray=this.state.approvables.concat(e.target.value);
      await this.setState({approvables: newarray})
    }else {
      let newarray=this.state.approvables;
      await this.setState({approvables: newarray.filter(pointer => pointer !== e.target.value)})
    }
    await console.log(des,this.state.approvables,e.target.value);
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
      <div className='text-center'>
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
          <form onSubmit={(e) => this.handleChange(e)}>
            <label> Add Data Owner
              <input className='w-40 px-4' type='text' placeholder='new Data Owner' onChange={(e) => this.handleChange(e)}/>
            </label>
          </form>
          <button className='px-4 hover:bg-green-400 hover:text-white' onClick={e => this.props.addDataOwner(e,this.state.submit)}>Add</button>
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
        <div className='flex item-center'>
          {this.props.PointerstoApprove.length>0 ?
            <form onSubmit={e => this.props.approvePointers(e,this.state.approvables)}>
              {this.props.PointerstoApprove.map((URI,index) =>
              <label key={index}>{URI}<input type='checkbox' id={index} value={URI} onChange={(e) =>this.handleCheckSubmit(e)}/></label>)}
              <button className='hover:bg-green-400 hover:text-white' type='submit'>Approve</button>
            </form> : <p>Everything up to date!</p>}
        </div>
      </div>
    );
  }
}


export default Main;
