import { withPluginApi } from "discourse/lib/plugin-api";

const matchProductionHost = () => {return window.location.host === "forum.makerdao.com"};

const html = () => { return "Import Maker Badges"; };
const click = (e) => {
  e.preventDefault();

  const username = Discourse.currentUser.username;

  window.ethereum.send('eth_requestAccounts').then((accounts) => {
    console.log("Ethereum Accounts", accounts);
    // Message params for signing request should be username & ethAddress

    const sendAsyncConfig = {
      method: 'personal_sign',
      params: [
        `${username}`, window.ethereum.selectedAddress,
        // 'username', window.ethereum.selectedAddress
      ],
      from: window.ethereum.selectedAddress,
    };

    const sendAsyncCallback = ((error, response) => {
      if (error) {
        // Handle error. Likely the user rejected the signature request
        console.error("Error with signing message:", error);
        document.getElementById('badge-error').innerText = error;
        return;
      }

      // Prepare message for delivery to lambda function
      const message = {
        username: username,
        address: window.ethereum.selectedAddress,
        signature: response.result,
      }
      console.log("Calling lambda function with message:", message);

      // Pass message to lambda function, unlocking any badges user has earned
      const requestOptions = {
        method: 'GET',
        mode: 'no-cors',
      };

      fetch(matchProductionHost() ? ThemeConfig.production.lambdaUrl(message) : ThemeConfig.digitalOcean.lambdaUrl(message), requestOptions)
        .then(response => response.json())
        .then(resolved => {
          console.log("resolved",resolved);

          document.getElementById('badge-error').innerText = resolved.errors; })
        .catch(error => { console.log(error);
      });

    });

    window.ethereum.sendAsync(sendAsyncConfig, sendAsyncCallback);
  });
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