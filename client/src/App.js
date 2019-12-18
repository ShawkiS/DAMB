import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import UploadFileForm from "./components/organisms/UploadFileForm/index";
import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };


  render() {
    return(
      <UploadFileForm />
    );
  }
}

export default App;
