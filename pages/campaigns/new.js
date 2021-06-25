import React, { Component } from 'react'
import Layout from '../../components/Layout'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import { Router } from '../../routes'

class CampaignNew extends Component {
	constructor (props) {
		super(props)
		this.state = {
			minimumContribution: '',
			errorMessage: '',
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	
	handleChange (e) {
		this.setState({ [e.target.name]: e.target.value })
	}
	
	async handleSubmit(e) {
		await e.preventDefault()
		const { minimumContribution } = this.state
		await this.setState({ loading: true, errorMessage: '' })
		try {
			const accounts = await web3.eth.getAccounts()
			await factory.methods
				.createCampaign(minimumContribution)
				.send({ from: accounts[0] })
			Router.pushRoute('/')
		} catch(e) {
			this.setState({ errorMessage: e.message, minimumContribution: '', loading: false })
		}
		this.setState({ loading: false })
	}
	
	render() {
		const { minimumContribution, errorMessage, loading } = this.state
		return (
			<Layout>
				<h3>Create a Campaign!</h3>
				<Form onSubmit={this.handleSubmit} error={!!errorMessage}>
					<Form.Field>
						<label>Minimum Contribution</label>
						<Input
							label={'wei'}
							labelPosition={'right'}
							name={'minimumContribution'}
							value={minimumContribution}
							onChange={this.handleChange}
							placeholder={'Minimum Contribution'}/>
					</Form.Field>
					<Button primary type={'submit'} loading={loading}>Create</Button>
					<Message error header={'Ope!'} content={errorMessage}>
					</Message>
				</Form>
			</Layout>
		)
	}
}

export default CampaignNew
