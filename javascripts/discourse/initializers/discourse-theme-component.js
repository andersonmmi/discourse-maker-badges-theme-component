import { withPluginApi } from "discourse/lib/plugin-api";

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
  const sendAsyncCallback = ( (error, response) => {
    if (error) {
      // Handle error. Likely the user rejected the signature request
      console.error("Error with signing message:", error);
      document.getElementById('badge-error').innerText = error;
      return;
    }

    data.signature = response.result
    console.log(data);
    
    callLambda()
    return data;
  });

  // POST Data to lambda
  const callLambda = () => {
    
    console.log("Sending lambda function this data:", data);
    
    // TODO: This method should send the data to the lambda service
    const properURL = matchProductionHost() ? ThemeConfig.production.lambdaUrl(data) : ThemeConfig.digitalOcean.lambdaUrl(data);
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", properURL, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        // Request finished. Do processing here.
        console.log("xhr.response", xhr.response);
        const json = JSON.parse(xhr.response);
        document.getElementById('badge-error').innerText = json.errors;
        // console.log("this", this);
      }
    }
    xhr.send();
    
  }
  // END DEF ************************************************************/


  // Composition Code
  const accounts = await window.ethereum.send('eth_requestAccounts');

  console.log("Ethereum Accounts", accounts);

  // This method doesn't "send" anything, it signs the message and returns the signed message.
  window.ethereum.sendAsync(sendAsyncConfig, sendAsyncCallback);
    
  // setTimeout(callLambda,25000)


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
