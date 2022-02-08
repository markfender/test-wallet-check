const Web3 = require('web3');
const path = require('path');
var express = require("express");
var app = express();

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/',function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get("/wallet/:network/:address", async (req, res, next) => {
  // validate address
  const address = req.params.address;
  const network = req.params.network;
  const listOfNetworks = ["mainnet", "kovan", "rinkeby", "goerli", "ropsten"];
  
  if(listOfNetworks.includes(network)) {
    const web3 = new Web3(new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/f2cc84ffee9345169758837187067a88`));

    if(web3.utils.isAddress(address)) {
      const walletBalance = await web3.eth.getBalance(address);
      res.status(200).json({
        "currentEthBalance": web3.utils.fromWei(walletBalance, "ether") + " ETH"
      });
    }
  } else {
    res.status(404).json({
      "error": "Wrong request"
    });
  }
});
 