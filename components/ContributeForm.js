import React, { Component } from 'react'
import { Form, Input, Button, Message } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'
import { Router } from '../routes'

class ContributeForm extends Component {
	constructor (props) {
		super(props)
		this.state = {
			value: '',
			loading: false,
			errorMessage: '',
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	
	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value })
	}
	
	async handleSubmit(e) {
		e.preventDefault()
		const { state: { value }, props: { address } } = this
		const campaign = await Campaign(address)
		await this.setState({ loading: true, errorMessage: '' })
		try {
			const accounts = await web3.eth.getAccounts()
			await campaign.methods.contribute().send({
				from: accounts[0],
				value: web3.utils.toWei(value, 'ether'),
			})
			await this.setState({ loading: false })
			Router.replaceRoute(`/campaigns/${address}`)
		} catch (e) {
			await this.setState({ loading: false, errorMessage: e.message })
		}
	}
	
	render () {
		const { value, loading, errorMessage } = this.state
		return (
			<Form onSubmit={this.handleSubmit} error={!!errorMessage}>
				<Form.Field>
					<label>Amount to Contribute</label>
					<Input
						label={'ether'}
						labelPosition={'right'}
						type={'text'}
						name={'value'}
						value={value}
						onChange={this.handleChange}/>
				</Form.Field>
				<Button primary type={'submit'} loading={loading}>Contribute!</Button>
				<Message error header={'Ope!'} content={errorMessage}>
				</Message>
			</Form>
		)
	}
}

export default ContributeForm
