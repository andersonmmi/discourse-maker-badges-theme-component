const ThemeConfig = {
    development: {
        lambdaUrl: (message)=>{return `http://075d145e319a.ngrok.io/dev/discourse?username=${message.username}&address=${message.address}&signature=${message.signature}`;}
    },
    production: {
        lambdaUrl: (message)=>{return `https://3nsc1491ed.execute-api.us-east-1.amazonaws.com/dev/discourse?username=${message.username}&address=${message.address}&signature=${message.signature}`;}
    }
};

export default {
    name: 'maker-badge',
    initialize(){
        globalThis.ThemeConfig = ThemeConfig;
    }
}