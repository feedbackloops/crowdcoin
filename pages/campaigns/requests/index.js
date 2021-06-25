import React, { Component } from 'react'
import { Button, Table } from 'semantic-ui-react'
import { Link } from '../../../routes'
import Layout from '../../../components/Layout'
import Campaign from '../../../ethereum/campaign'
import RequestRow from '../../../components/RequestRow'

class RequestIndex extends Component {
	
	static async getInitialProps(props) {
		const { address } = await props.query
		const campaign = await Campaign(address)
		const requestsCount = await campaign.methods.getRequestsCount().call()
		const approversCount = await campaign.methods.approversCount().call()
		const requests = await Promise.all(
			Array(parseInt(requestsCount))
				.fill()
				.map((x, i) => {
					return campaign.methods.requests(i).call()
				})
		)
		return { address, requests, requestsCount, approversCount }
	}
	
	renderRows() {
		const { requests, address, approversCount } = this.props
		return requests.map((x, i) => {
			return (
				<RequestRow
					key={i}
					id={i}
					request={x}
					approversCount={approversCount}
					address={address}/>
			)
		})
	}
	
	render () {
		const { address, requestsCount } = this.props
		return (
			<Layout>
				<h3>Requests</h3>
				<Link route={`/campaigns/${address}/requests/new`}>
					<a>
						<Button primary>Add Request</Button>
					</a>
				</Link>
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>ID</Table.HeaderCell>
							<Table.HeaderCell>Description</Table.HeaderCell>
							<Table.HeaderCell>Amount</Table.HeaderCell>
							<Table.HeaderCell>Recipient</Table.HeaderCell>
							<Table.HeaderCell>Approval Count</Table.HeaderCell>
							<Table.HeaderCell>Approve</Table.HeaderCell>
							<Table.HeaderCell>Finalize</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{this.renderRows()}
					</Table.Body>
				</Table>
				<div>Found {requestsCount} requests.</div>
			</Layout>
		)
	}
}

export default RequestIndex
