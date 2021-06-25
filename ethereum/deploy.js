const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
// const { interface, bytecode } = require('./compile')
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
	// remember to change this to your own phrase!
	process.env.mnemonic,
	// remember to change this to your own endpoint!
	'https://rinkeby.infura.io/v3/3cc6063b9e2e448a9f36f23b3a1630cd'
)
const web3 = new Web3(provider)

const deploy = async () => {
	const accounts = await web3.eth.getAccounts()
	
	console.log('Attempting to deploy from account', accounts[0])
	
	const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ gas: '1000000', from: accounts[0] })
	
	console.log(compiledFactory.interface)
	console.log('Contract deployed to', result.options.address)
}
deploy()
