pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
import './Ownable.sol';

contract DAMBMarketplace { 
    address didRegistryAddress = address(0xb1eA341724Fdcd53CA39d7DE3264bB89E6120BE4);
    address accessSecretStoreConditionAddress = address(0xb1eA341724Fdcd53CA39d7DE3264bB89E6120BE4);
uint256 idCounter;

struct publicAsset { 
    uint256 _id;
    bytes32 _documentId;
    bool _isValid;
    address payable _owner;
    string _name;
    string _description;
    uint256 _etherPrice;
    address[] _buyers;
}

struct privateAsset { 
    uint256 _id;
    bytes32 _documentId;
    uint256 _etherPrice;
    address[] _buyers;
    address payable  _owner;
}

publicAsset[] publicAssets;
privateAsset[] _privateAssets;



event create(uint256 _id, address _owner, string _name, string _description, uint256 _usdPrice);
event buy(uint256 _id, address buyer);
event remove(uint256 _id);


 function getAllPublicAssets() public returns(publicAsset[] memory ){
    return publicAssets;
}

 function addPublicAsset(uint256 _id,
                         string memory _name,
                         string memory _description,
                         uint256 _usdPrice,
                         bytes32 _did,
                         bytes32 _checksum,
                         address[] memory _providers,
                         string memory _value
                         ) public
                          {     
    idCounter+=1;
    
    publicAsset storage newPublicAsset = publicAssets[idCounter];
    newPublicAsset._id = idCounter;
    newPublicAsset._isValid = true;
    newPublicAsset._owner = msg.sender;
    newPublicAsset._name = _name;
    newPublicAsset._description = _description;
    newPublicAsset._etherPrice = _usdPrice;
    
    didRegistryAddress.call(abi.encodeWithSignature(
"registerAttribute(bytes32 _did,bytes32 _checksum, address[] memory _providers, string memory _value)", 
_did, _checksum, _providers, _value));

  emit create(_id, msg.sender, _name, _description, _usdPrice);
  }
 


 function removeAsset(uint256 _id) public {
   publicAssets[_id]._isValid = false;
}

 function BuyAsset(uint256 _id, bool isPrivate) public payable  { 
    if(isPrivate){
        privateAsset storage pa = _privateAssets[_id];
        require(msg.value == pa._etherPrice);
        pa._owner.transfer(msg.value);
    
    accessSecretStoreConditionAddress.call(abi.encodeWithSignature(
    "grantPermission(address _grantee, bytes32 _documentId)", msg.sender, pa._documentId));
    }
    else {  
        publicAsset storage pa = publicAssets[_id];
        require(msg.value == pa._etherPrice);
        pa._owner.transfer(msg.value);
    accessSecretStoreConditionAddress.call(abi.encodeWithSignature(
    "grantPermission(address _grantee, bytes32 _documentId)", msg.sender, pa._documentId));
    }
    }

 function isAddressBoughtAsset(address _add, uint256 _assetId, bool _isPrivate) public returns (bool) {
    if(_isPrivate) {
        privateAsset storage asset = _privateAssets[_assetId];
        for (uint i=0; i< asset._buyers.length; i++) {
            require(_add != asset._buyers[i]);
            return true;
        }
    }
    else { 
        publicAsset storage asset = publicAssets[_assetId];
        for (uint i=0; i< asset._buyers.length; i++) {
            require(_add != asset._buyers[i]);
            return true;
        }
    } 
}
}
