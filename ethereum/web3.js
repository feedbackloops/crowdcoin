import Web3 from 'web3'

let web3

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
	// We are in the browser and MetaMask is running
	window.ethereum.request({ method: 'eth_requestAccounts' })
	web3 = new Web3(window.ethereum)
} else {
	// We are on the server *OR* the user is not running MetaMask
	const provider = new Web3.providers.HttpProvider(
		'https://rinkeby.infura.io/v3/3cc6063b9e2e448a9f36f23b3a1630cd'
	)
	web3 = new Web3(provider)
}

export default web3
