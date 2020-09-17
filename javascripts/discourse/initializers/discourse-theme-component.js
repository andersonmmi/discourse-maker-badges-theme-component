import { withPluginApi } from "discourse/lib/plugin-api";

let data = {};

const matchProductionHost = () => {return window.location.host === "forum.makerdao.com"};

const html = () => { return "Import Maker Badges"; };
const click = (e) => {
  e.preventDefault();

  // TODO: This method unlocks and returns the active address in metamask
  window.ethereum.send('eth_requestAccounts').then((accounts) => {
    console.log("Ethereum Accounts", accounts);
  }); 

  alert("booooong");

  // // This username is the same as the "message" that gets signed
  // const username = Discourse.currentUser.username;

  // // This parameter tells "window.ethereum.sendAsync" what to do: "personally sign with these params, from me"
  // const sendAsyncConfig = {
  //   method: 'personal_sign',
  //   params: [
  //     // Message params for signing request are username & ethAddress
  //     `${username}`, window.ethereum.selectedAddress,
  //   ],
  //   from: window.ethereum.selectedAddress,
  // };

  // // TODO: This callback should should give us back the signature if it's successful 
  // const sendAsyncCallback = ((error, response) => {
  //   if (error) {
  //     // Handle error. Likely the user rejected the signature request
  //     console.error("Error with signing message:", error);
  //     document.getElementById('badge-error').innerText = error;
  //     return;
  //   }

  //     // Send Lambda the user's discourse username, ethereum address, and signature
  //   data = {
  //     username: username,
  //     address: window.ethereum.selectedAddress,
  //     signature: response.result,
  //   }
  //   console.log("This is the data to send to lambda:", data);

  //   return
  // });

  // // Pass data to lambda function, unlocking any badges user has earned
  // const requestOptions = {
  //   method: 'GET',
  //   mode: 'no-cors',
  // };

  // // TODO: This method signs the message and sets data accordingly.
  // window.ethereum.sendAsync(sendAsyncConfig, sendAsyncCallback);

  // // TODO: This method should send the data to the lambda service
  // fetch(matchProductionHost() ? ThemeConfig.production.lambdaUrl(data) : ThemeConfig.digitalOcean.lambdaUrl(data), requestOptions)
  // .then(response => response.json())
  // .then(resolved => {
  //   console.log("resolved",resolved);

  //   document.getElementById('badge-error').innerText = resolved.errors; })
  // .catch(error => { console.log(error); });
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