https://docs.moralis.io/web3-data-api/evm/quickstart-nodejs

Quickstart NodeJS
Introduction
This tutorial will teach you how to set up a server-side dapp that can query blockchain data, such as NFTs, tokens, balances, transfers, transactions, etc., from any NodeJS application. This tutorial dapp works on almost any blockchain, including Ethereum, Polygon, BNB Chain, Avalanche, Cronos, and many more!

Prerequisites
Create a Moralis account
Install and set up your editor of choice (we will use Visual Studio Code [VSC] in this tutorial)
Install NodeJS
Create a NodeJS Dapp
For this part of the tutorial, we will create a dapp that displays the native balance, ERC-20 tokens, and NFTs for any address and EVM chain!

Create a new folder for your project
Open the folder in your editor
Initialize a new project via npm

npm init

Give it a name and fill in the details as you want (press enter to use the default options). Now you should have a package.json file that looks something like this:

{
"name": "simple-nodejs-demo",
"version": "1.0.0",
"description": "",
"main": "index.js",
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1"
},
"author": "",
"license": "ISC"
}

Install the dependencies express and moralis:
npm install moralis express @moralisweb3/common-evm-utils

Set Up an Express Server
Create an index.js file and set up Express with the following code:
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
res.send("Hello World!");
});

app.listen(port, () => {
console.log(`Example app listening on port ${port}`);
});

Add a new script to package.json called start:
"scripts": {
"start": "node index.js"
},

Run the server by calling npm run start.
Make sure that the server runs by going to http://localhost:3000. It should show "Hello World!".
Add Moralis to Your Dapp
Get your Web3 Api Key from the Moralis dashboard:
4n3pANatV2_KA3lpaig2g_screenshot-2022-08-08-at-150705.webp

Import moralis and initialize it with your API key in index.js:
Replace the address with the address where you want to get crypto data from. Accordingly, replace the chain with the corresponding chain (you can use EvmChain.ETHEREUM, EvmChain.ROPSTEN, EvmChain.BSC, EvmChain.POLYGON, etc.). See more info on: Data Types and Supported Chains.
const express = require("express");
// Import Moralis
const Moralis = require("moralis").default;
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
const port = 3000;

// Add a variable for the api key, address and chain
const MORALIS_API_KEY = "replace_me";
const address = "replace_me";
const chain = EvmChain.ETHEREUM;

app.get("/", (req, res) => {
res.send("Hello World!");
});

// Add this a startServer function that initialises Moralis
const startServer = async () => {
await Moralis.start({
apiKey: "xxx",
});

app.listen(port, () => {
console.log(`Example app listening on port ${port}`);
});
};

// Call startServer()
startServer();

Fetch and Display Native Balance
Now, we can fetch data by using the Moralis API. Add the getDemoData function:
async function getDemoData() {
// Get native balance
const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
address,
chain,
});

// Format the native balance formatted in ether via the .ether getter
const native = nativeBalance.result.balance.ether;

return { native };
}

Then add the /crypto-data endpoint that will return the result of this function:
app.get("/demo", async (req, res) => {
try {
// Get and return the crypto data
const data = await getDemoData();
res.status(200);
res.json(data);
} catch (error) {
// Handle errors
console.error(error);
res.status(500);
res.json({ error: error.message });
}
});

When you call this endpoint as <http://localhost:3000/demo>, you should get an object with the native balance as a response:

{
"native": "0.169421625822962794"
}

Fetch and Display ERC-20 Balances
Fetch token balances in the getDemoData function:
async function getDemoData() {
const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
address,
chain,
});
const native = nativeBalance.result.balance.ether;

// Get token balances
const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
address,
chain,
});

// Format the balances to a readable output with the .display() method
const tokens = tokenBalances.result.map((token) => token.display());

// Add tokens to the output
return { native, tokens };
}

Fetch and Display NFTs with Metadata
Fetch the first ten NFTs using getDemoData:
async function getDemoData() {
const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
address,
chain,
});
const native = nativeBalance.result.balance.ether;

const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
address,
chain,
});
const tokens = tokenBalances.result.map((token) => token.display());

// Get the nfts
const nftsBalances = await Moralis.EvmApi.nft.getWalletNFTs({
address,
chain,
limit: 10,
});

// Format the output to return name, amount and metadata
const nfts = nftsBalances.result.map((nft) => ({
name: nft.result.name,
amount: nft.result.amount,
metadata: nft.result.metadata,
}));

// Add nfts to the output
return { native, tokens, nfts };
}

All Done!
You've now created a simple NodeJS server with Express and Moralis that fetches crypto data of the provided address and chain. Well done!

The final code after this tutorial should look something like this:

const express = require("express");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
const port = 3000;

const MORALIS_API_KEY = "replace_me";
const address = "0x9e8f0f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f";
const chain = EvmChain.ETHEREUM;

async function getDemoData() {
// Get native balance
const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
address,
chain,
});

// Format the native balance formatted in ether via the .ether getter
const native = nativeBalance.result.balance.ether;

// Get token balances
const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
address,
chain,
});

// Format the balances to a readable output with the .display() method
const tokens = tokenBalances.result.map((token) => token.display());

// Get the nfts
const nftsBalances = await Moralis.EvmApi.nft.getWalletNFTs({
address,
chain,
limit: 10,
});

// Format the output to return name, amount and metadata
const nfts = nftsBalances.result.map((nft) => ({
name: nft.result.name,
amount: nft.result.amount,
metadata: nft.result.metadata,
}));

return { native, tokens, nfts };
}

app.get("/demo", async (req, res) => {
try {
// Get and return the crypto data
const data = await getDemoData();
res.status(200);
res.json(data);
} catch (error) {
// Handle errors
console.error(error);
res.status(500);
res.json({ error: error.message });
}
});

const startServer = async () => {
await Moralis.start({
apiKey: MORALIS_API_KEY,
});

app.listen(port, () => {
console.log(`Example app listening on port ${port}`);
});
};

startServer();
