import Web3 from 'web3'
import {DAMBMarketplace} from '../contracts/DAMBMarketplace'

interface dambMarketplace {
  account: String
  dampMarketplace: Window["web3"];
  assetsCount: Number
  publicAssets: []
}
declare global {
  interface Window { web3: any; ethereum; }
}
export class DAMBMarketplaceServices {
  state: dambMarketplace

  async componentWillMount () {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  constructor () {
    const web3 = window.web3
    const networkId = web3.eth.net.getId()
    const networkData = DAMBMarketplace.networks[networkId]

    this.state = {
      account: web3.eth.getAccounts(),
      dampMarketplace: web3.eth.Contract(
        DAMBMarketplace.abi,
        networkData.address
      ),
      assetsCount: this.state.dampMarketplace.methods.idCounter().call(),
      publicAssets: []
    }

    for (var i = 1; i <= this.state.assetsCount; i++) {
     this.state.dampMarketplace.methods.publicAssets(i).call()

  } 
  }
  async loadWeb3 () {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
  }

  async loadBlockchainData () {

    
  }

  getAllPublicAssets () {
    return this.state.dampMarketplace.methods
      .getAllPublicAssets()
      .send({ from: this.state.account })
  }

  addPublicAsset (
    id: String,
    name: String,
    description: String,
    etherPrice: String,
    did: String,
    checksum: String,
    providers: String,
    value: String
  ) {
    this.state.dampMarketplace.methods
      .addPublicAsset(
        id,
        name,
        description,
        etherPrice,
        did,
        checksum,
        providers,
        value
      )
      .send({ from: this.state.account })
  }

  removeAsset (id: String) {
    return this.state.dampMarketplace.methods
      .removeAsset(id)
      .send({ from: this.state.account })
  }

  buyAsset (id: String, isPrivate: Boolean, amount: String) {
    return this.state.dampMarketplace.methods
      .buyAsset(id, isPrivate)
      .send({ from: this.state.account, value: amount })
  }

  isAddressBoughtAsset (address: String, assetId: String, isPrivate: Boolean) {
    return this.state.dampMarketplace.methods
      .isAddressBoughtAsset(address, assetId, isPrivate)
      .send({ from: this.state.account })
  }
}
