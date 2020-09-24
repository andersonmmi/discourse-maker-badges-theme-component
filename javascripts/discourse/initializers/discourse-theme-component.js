import { withPluginApi } from "discourse/lib/plugin-api";

const matchProductionHost = () => { return window.location.host === "forum.makerdao.com"};

const html = () => { return "Import Maker Badges"; };

// POST Data to lambda
const queryBadgesAPI = (data) => {
  console.log("Sending lambda function this data:", data);

  const xhr       = new XMLHttpRequest();
  const properURL = matchProductionHost() ? ThemeConfig.production.lambdaUrl(data) : ThemeConfig.digitalOcean.lambdaUrl(data);

  xhr.open("GET", properURL, true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/json");

  // Call a function when the state changes.
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      document.getElementById('badge-error').innerText = "Redemption successful.";
      try {
        const json = JSON.parse(xhr.response); console.log(json.badges);
        document.getElementById('badge-error').innerText = json.errors;
      }
      catch (error) { document.getElementById('badge-error').innerText = 'Badges API - JSON Parse Error'; }
    }
  }

  xhr.send();
}

const click = (e) => {
  e.preventDefault();

  // This username is the same as the "message" that gets signed
  const username = Discourse.currentUser.username;

  // Params username, ethereum address,
  // and signature null until returned from ethers call
  const data = {
    username: username,
    address: window.ethereum.selectedAddress,
    signature: null,
  }

  // This callback should should give us back the signature if it's successful
  const callback = ((error, response) => {
    if (error) { console.error("Error with signing message:", error);
      document.getElementById('badge-error').innerText = error.message;
      return error;
    }

    data.signature = response.result

    return queryBadgesAPI(data);
  });

  // get eth accounts; use .then to immediately sign message after wallet connection
  window.ethereum.send('eth_requestAccounts')
    .then(()=>{
      // This parameter tells "window.ethereum.sendAsync" what to do:
      // "personally sign with these params, from me"
      const config = {
        method: 'personal_sign',
        params: [
          // message, signer
          `${username}`, window.ethereum.selectedAddress,
        ],
        from: window.ethereum.selectedAddress,
      };
      return config;
    }).then((config)=>{
    // This method signs the message, returns the signed message to the callback.
    window.ethereum.sendAsync(config, callback);
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
        },
      );
    });
  }
}
