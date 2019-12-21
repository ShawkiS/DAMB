const DAMBMarketplace = artifacts.require("DAMBMarketplace");

module.exports = function(deployer) {
    deployer.deploy(DAMBMarketplace);
};
