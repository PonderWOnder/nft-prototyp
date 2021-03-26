import React,{Component} from 'react';

class Buyables extends Component {
  render() {
    return (
      <div className='tokens'>
        <ul>
          {this.props.buyable.map((value,index) => <li key={index}>{value}</li>)}
        </ul>
      </div>
    );
  }
}
export default Buyables
