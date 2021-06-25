import React, { Component } from 'react'
import Layout from '../../components/Layout'
import Campaign from '../../ethereum/campaign'
import { Button, Card, Grid } from 'semantic-ui-react'
import web3 from '../../ethereum/web3'
import ContributeForm from '../../components/ContributeForm'
import { Link } from '../../routes'

class CampaignShow extends Component {
	static async getInitialProps(props) {
		const campaign = Campaign(props.query.address)
		const summary = await campaign.methods.getSummary().call()
		return {
			address: props.query.address,
			minimumContribution: summary[0],
			balance: summary[1],
			requestsCount: summary[2],
			approversCount: summary[3],
			manager: summary[4],
		}
	}
	
	renderCards() {
		const { minimumContribution, balance, requestsCount, approversCount, manager } = this.props
		const items = [
			{
				header: manager,
				meta: 'The address of the manager.',
				description: 'The manager created this campaign and can create requests to withdraw money.',
				style: {
					overflowWrap: 'break-word',
				},
				key: 0,
			},
			{
				header: minimumContribution,
				meta: 'Minimum Contribution (wei)',
				description: 'You must contribute at least this much wei to become an approver.',
				key: 1,
			},
			{
				header: requestsCount,
				meta: 'Number of requests',
				description: 'A request tries to withdraw money from the contract. Request must be approved by approvers.',
				key: 2,
			},
			{
				header: approversCount,
				meta: 'Number of Approvers',
				description: 'Number of people who have already donated to this campaign.',
				key: 3,
			},
			{
				header: web3.utils.fromWei(balance, 'ether'),
				meta: 'Campaign Balance (ether)',
				description: 'The balance is how much money this campaign has left to spend.',
				key: 4,
			},
		]
		return <Card.Group items={items}/>
	}
	
	render () {
		const { address } = this.props
		return (
			<Layout>
				<h3>Campaign Show</h3>
				<Grid>
					<Grid.Row>
						<Grid.Column width={10}>
							{this.renderCards()}
						</Grid.Column>
						<Grid.Column width={6}>
							<ContributeForm address={address}/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							<Link route={`/campaigns/${address}/requests`}>
								<a>
									<Button primary>View Requests</Button>
								</a>
							</Link>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Layout>
		)
	}
}

export default CampaignShow
