const DAMBMarketplace = artifacts.require('./contracts/DAMBMarketplace.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('DAMBMarketplace', ([deployer, author, tipper]) => {
    let dambMarketplace

    before(async () => {
        dambMarketplace = await DAMBMarketplace.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await socialNetwork.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
    })
})