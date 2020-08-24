

// document.addEventListener('DOMContentReady', function () {
//     button.addEventListener('click', connectWallet);
//   });

const addClickHandler = {
    addClickHandler: () =>{
        return document.addEventListener('DOMContentReady', function () {
            const button = document.getElementById("connectWallet");
            button.addEventListener('click', connectWallet);
        })
    },
    connectWallet: (e) => {
        e.preventDefault();
        console.log("We hit connectWallet", e)
        return window.ethereum.enable();
    },
}

addClickHandler.addClickHandler();
export default addClickHandler;