const button = document.getElementById("connectWallet");

document.addEventListener('DOMContentReady', function () {
    button.addEventListener('click', connectWallet);
  });

export default connectWallet = (e) => {
    e.preventDefault();
    console.log("We hit connectWallet", e)
    window.ethereum.enable();
};