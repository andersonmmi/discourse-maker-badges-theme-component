export default {
    development: {
        lambdaUrl: (message)=>{return `http://075d145e319a.ngrok.io/dev/discourse?username=${message.username}&address=${message.address}&signature=${message.signature}`;}
    },
    production: {
        lambdaUrl: (message)=>{return `http://075d145e319a.ngrok.io/dev/discourse?username=${message.username}&address=${message.address}&signature=${message.signature}`;}
    }
}