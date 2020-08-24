const button = document.getElementById("connectWallet");

document.addEventListener('DOMContentReady', function () {
    button.addEventListener('click', connectWallet);
  });

export default connectWallet = () => {
    window.ethereum.enable();
};