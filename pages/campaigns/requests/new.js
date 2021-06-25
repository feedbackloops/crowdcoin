import React, { Component } from 'react'
import Layout from '../../../components/Layout'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'
import { Link, Router } from '../../../routes'

class RequestNew extends Component {
	static async getInitialProps(props) {
		const { address } = props.query
		return { address }
	}
	constructor (props) {
		super(props);
		this.state = {
			address: props.address,
			description: '',
			errorMessage: '',
			loading: false,
			recipient: '',
			value: '',
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	
	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value })
	}
	
	async handleSubmit(e) {
		e.preventDefault()
		const { state: { description, value, recipient }, props: { address } } = this
		const campaign = await Campaign(address)
		await this.setState({ loading: true, errorMessage: '' })
		try {
			const accounts = await web3.eth.getAccounts()
			await campaign.methods
				.createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
				.send({ from: accounts[0] })
			Router.pushRoute(`/campaigns/${this.props.address}/requests`)
		} catch (e) {
			await this.setState({ errorMessage: e.message })
		}
		await this.setState({ loading: false })
	}
	
	render() {
		const { description, recipient, value, loading, errorMessage } = this.state
		return (
			<Layout>
				<Link route={`/campaigns/${this.props.address}/requests`}>
					<a>
						<Button primary>Back</Button>
					</a>
				</Link>
				<h3>Create a Request</h3>
				<Form onSubmit={this.handleSubmit} error={!!errorMessage}>
					<Form.Field>
						<label>Description</label>
						<Input
							type={'text'}
							name={'description'}
							value={description}
							onChange={this.handleChange}
							placeholder={'Description of the request'}/>
					</Form.Field>
					<Form.Field>
						<label>Value</label>
						<Input
							type={'text'}
							name={'value'}
							value={value}
							onChange={this.handleChange}
							placeholder={'Amount in Ether'}/>
					</Form.Field>
					<Form.Field>
						<label>Recipient</label>
						<Input
							type={'text'}
							name={'recipient'}
							value={recipient}
							onChange={this.handleChange}
							placeholder={'Address of the recipient of the funds'}/>
					</Form.Field>
					<Button primary type={'submit'} loading={loading}>Create!</Button>
					<Message error header={'Ope!'} content={errorMessage}>
					</Message>
				</Form>
			</Layout>
		)
	}
}

export default RequestNew
