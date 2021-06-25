import web3 from './web3'
import Campaign from './build/Campaign.json'

// cant write hard coded info because it's dynamically generated.
export default (address) => {
	return new web3.eth.Contract(
		JSON.parse(Campaign.interface),
		address
	)
}
