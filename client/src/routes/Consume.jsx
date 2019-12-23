import React, { Component } from 'react'
import Route from '../components/templates/Route'
import Button from '../components/atoms/Button'
import Web3 from 'web3'
import { Ocean } from '@oceanprotocol/squid'


let web3

class Consume extends Component {

    state = {
        ocean: any,
        results: [],
        ddo: undefined
    }


    async componentDidMount() {
        web3 = new Web3(window.web3.currentProvider)
        window.ethereum.enable()

        const ocean = await Ocean.getInstance({
            web3Provider: web3,
            nodeUri: 'https://nile.dev-ocean.com',
            aquariusUri: 'https://aquarius.marketplace.dev-ocean.com',
            brizoUri: 'https://brizo.marketplace.dev-ocean.com',
            brizoAddress: '0x4aaab179035dc57b35e2ce066919048686f82972',
            secretStoreUri: 'https://secret-store.nile.dev-ocean.com',
            verbose: true
        })
        this.setState({ ocean })
        console.log('Finished loading contracts.')
    }

    async consumeAsset() {
        try {
          // get all accounts
          const accounts = await this.state.ocean.accounts.list()
          // get our registered asset
          const consumeAsset = this.state.ddo
          // get service we want to execute
          const service = consumeAsset.findServiceByType('access')
          // order service agreement
          const agreement = await this.state.ocean.assets.order(
            consumeAsset.id,
            service.index,
            accounts[0]
          )
          // consume it
          await this.state.ocean.assets.consume(
            agreement,
            consumeAsset.id,
            service.index,
            accounts[0],
            '',
            0
          )
        } catch (error) {
          console.error(error.message)
        }
      }

    public render() {
        return <Route title="Consume">
            <h3>Copy Code and Paste on HTML </h3>
            <code>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis iusto consequatur nemo corrupti eos illum, velit facilis maxime consequuntur inventore quibusdam quae, ducimus autem in. Sed perferendis laudantium distinctio dolor.            </code>

            <div style={{ float: 'left', marginTop: '2rem', display: 'block' }}>
                <div style={{ margin: '100px', display: 'inline' }}>
                    <Button primary>Publish Data</Button>
                </div>
                <Button primary>Download</Button>
            </div>

        </Route>
    }
}

export default Consume
