const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
// Import Moralis
const Moralis = require("moralis").default
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils")

const app = express()
const port = 3000

// Add a variable for the api key, address and chain
const MORALIS_API_KEY = process.env.MORALIS_API_KEY
const address = "0x02a23117BB08e802eE5AC7e0F9a2eE4fAaD5D79C"
const chain = EvmChain.SEPOLIA

async function getDemoData() {
    // Get native balance
    const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
        address,
        chain,
    })

    // Format the native balance formatted in ether via the .ether getter
    const native = nativeBalance.result.balance.ether

    return { native }
}

async function getDemoData() {
    const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
        address,
        chain,
    })
    const native = nativeBalance.result.balance.ether

    // Get token balances
    const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain,
    })

    // Format the balances to a readable output with the .display() method
    const tokens = tokenBalances.result.map((token) => token.display())

    // Get the nfts
    const nftsBalances = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
        limit: 10,
    })

    // Format the output to return name, amount and metadata
    const nfts = nftsBalances.result.map((nft) => ({
        name: nft.result.name,
        amount: nft.result.amount,
        metadata: nft.result.metadata,
    }))

    // Add tokens to the output
    return { native, tokens, nfts }
}

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.get("/demo", async (req, res) => {
    try {
        // Get and return the crypto data
        const data = await getDemoData()
        res.status(200)
        res.json(data)
    } catch (error) {
        // Handle errors
        console.error(error)
        res.status(500)
        res.json({ error: error.message })
    }
})

// Add this a startServer function that initialises Moralis
const startServer = async () => {
    await Moralis.start({
        apiKey: MORALIS_API_KEY,
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

// Call startServer()
startServer()
