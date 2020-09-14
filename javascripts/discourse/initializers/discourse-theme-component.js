import { withPluginApi } from "discourse/lib/plugin-api";

const matchProductionHost = () => {return window.location.host === "forum.makerdao.com"};

export default {
  name: "maker-badges",
  initialize(){
    withPluginApi("0.8.7", api => {
      api.createWidget('maker-badges-loader-widget', {
        tagName: "button.maker-badges",
        html() {
          return "Import Maker Badges";
        },
        click(e) {
          e.preventDefault();
          
          const username = Discourse.currentUser.username;
          
          try {
            // NOTE: window.ethereum.send and window.ethereum.sendAsync are being deprecated in favor of window.ethereum.request
            //       The new method is not current widely used or well documented, so it hasn't been implemented here yet
            // Request wallet access and account list
            window.ethereum.send('eth_requestAccounts').then((accounts) => {
              console.log("Ethereum Accounts", accounts);
              // Message params for signing request should be username & ethAddress
              window.ethereum.sendAsync(  {
                method: 'personal_sign',
                params: [
                  `${username}`, window.ethereum.selectedAddress
                ],
                from: window.ethereum.selectedAddress
              },
              (error, response) => {
                if (error) {
                  
                  // Handle error. Likely the user rejected the signature request
                  console.error("Error with signing message:", error);
                  
                } else {
                  
                  // Prepare message for delivery to lambda function
                  const message = {
                    username: username,
                    address: window.ethereum.selectedAddress,
                    signature: response.result
                  }
                  console.log("Calling lambda function with message:", message);
                  
                  // Pass message to lambda function, unlocking any badges user has earned
                  const requestOptions = {
                    method: 'GET',
                  };
                  fetch(
                    matchProductionHost() ? ThemeConfig.production.lambdaUrl(message) : ThemeConfig.development.lambdaUrl(message),
                    requestOptions
                    )
                    .then(res => res.json())
                    .then(resolved => console.log("Lambda function complete", resolved))
                  }
                })
              });
            } catch (error) {
              console.log("User denied Ethereum account access");
            }
          }
        });
      });
    }
  }