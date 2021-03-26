import React,{Component} from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
export default class App extends React.Component {
  //other logic
  render() {
    return (
      <Loader type="Hearts" color="#00BFFF" height={80} width={80} />
    );
  }
}
