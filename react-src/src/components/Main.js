import React,{Component} from 'react'

class Main extends Component {

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
      <div id='content' className='mt-3'>
        <table>
          <tbody>
            <tr>
              <td>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <label> Create Pointer
                    <input type='text' placeholder='new Pointer' onChange={(e) => this.handleChange(e)}/>
                  </label>
                </form>
              </td>
              <td>
                <button onClick={e => this.props.makePointer(e,this.state.submit)}>Submit</button>
              </td>
            </tr>
            <tr>
              <td> ETH Balance</td>
              <td> NXNFT Balance</td>
              <td>
                <button onClick={e => this.props.mint(e,this.state.submit)}>MINT</button>
              </td>
            </tr>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.Ubalance.toString(), 'ether').substring(0,6)} ETH</td>
              <td>{this.props.UNFTbalance.toString()} NFT</td>
              <td>
                  <select defaultValue='Choose here' onChange={(e) => this.handleChange(e)} placeholder='Pointers'>
                    <option selected disabled hidden>Choose here</option>
                    {this.props.Pointers.map((URI,index) =>
                      <option key={index+1} value={URI}>{URI}</option>
                    )}
                  </select>
              </td>
            </tr>
            <tr>
              <td>
              </td>
              <td>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}


export default Main;
