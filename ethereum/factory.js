import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'0x43F20a3381e84B70CC55D14cafD1c8CC7894449b',
)

export default instance
