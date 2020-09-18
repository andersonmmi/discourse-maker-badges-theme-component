import { withPluginApi } from "discourse/lib/plugin-api";
// import axios from "./axios.js";
// const axios = require('./axios').default;
// console.log(axios);

const matchProductionHost = () => {return window.location.host === "forum.makerdao.com"};

const html = () => { return "Import Maker Badges"; };

const click = async (e) => {
  e.preventDefault();
  /***********************************************************************/
  // Definitions ********************************************************/
  // This username is the same as the "message" that gets signed
  const username = Discourse.currentUser.username;

  // Params username, ethereum address,
  // and signature null until returned from ethers call
  const data = {
    username: username,
    address: window.ethereum.selectedAddress,
    signature: null,
  }

  // This parameter tells "window.ethereum.sendAsync" what to do:
  // "personally sign with these params, from me"
  const sendAsyncConfig = {
    method: 'personal_sign',
    params: [
      // message, signer
      `${username}`, window.ethereum.selectedAddress,
    ],
    from: window.ethereum.selectedAddress,
  };

  // This callback should should give us back the signature if it's successful
  const sendAsyncCallback = ( async (error, response) => {
    if (error) {
      // Handle error. Likely the user rejected the signature request
      console.error("Error with signing message:", error);
      document.getElementById('badge-error').innerText = error;
      return;
    }

    data.signature = response.result
    console.log(data);
    
    return data;
  });

  // POST Data to lambda
  const callLambda = () => {
    return new Promise(async (resolve, reject) => {
    
    
    console.log("Sending lambda function this data:", data);
    
    // TODO: This method should send the data to the lambda service
    const properURL = matchProductionHost() ? ThemeConfig.production.lambdaUrl(data) : ThemeConfig.digitalOcean.lambdaUrl(data);
    // const resData = await axios.get(properURL);
    // custom fetch---------------
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", properURL, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
      console.log("xhr", xhr);
      console.log("this", this);
    }
    }
    xhr.send();
    // xhr.send(new Int8Array());
    // xhr.send(document);

    // end custom fetch-----------
    console.log("resData:", resData);
    const json = JSON.parse(resData.data);
    
    document.getElementById('badge-error').innerText = json.errors;
    
    if (json) { resolve(json); }
    else { reject(); }
    });
  }
  // END DEF ************************************************************/


  // Composition Code
  const accounts = await window.ethereum.send('eth_requestAccounts');

  console.log("Ethereum Accounts", accounts);

  // This method doesn't "send" anything, it signs the message and returns the signed message.
  window.ethereum.sendAsync(sendAsyncConfig, sendAsyncCallback);
    
  setTimeout(callLambda,60000)
  // =>{
  //   const json = await callLambda(data);
  //   console.log("json:", json);
  // }, 6000);
  

  console.log("This should run before sendAsync")

}

export default {
  name: "maker-badges",
  initialize() {
    withPluginApi("0.8.7", api => {
      api.createWidget(
        'maker-badges-loader-widget',
        {
          tagName: "button.maker-badges",
          html,
          click,
        }
      );
    });
  }
}
