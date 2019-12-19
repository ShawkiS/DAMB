    pragma solidity ^0.5.0;
    
    contract DambDidRegistry { 
        
    import './DIDRegistryLibrary.sol';
    import 'openzeppelin-eth/contracts/ownership/Ownable.sol';
        
        
        using DIDRegistryLibrary for DIDRegistryLibrary.DIDRegisterList;
    
    
        /**
         * @dev state storage for the DID registry
         */
        DIDRegistryLibrary.DIDRegisterList internal didRegisterList;
    
        // DID -> Address -> Boolean Permission
        mapping(bytes32 => mapping(address => bool)) DIDPermissions;
        mapping(bytes32 => uint256) DIDPrices;
    
        /**
         * @dev This implementation does not store _value on-chain,
         *      but emits DIDAttributeRegistered events to store it in the event log.
         */
        event DIDAttributeRegistered(
            bytes32 indexed _did,
            address indexed _owner,
            bytes32 indexed _checksum,
            string _value,
            address _lastUpdatedBy,
            uint256 _blockNumberUpdated,
            uint256 _didPrice
        );
    
        event DIDProviderAdded(
            bytes32 _did,
            address _provider
        );
    
    
        /**
         * @dev DIDRegistry Initializer
         *      Initialize Ownable. Only on contract creation.
         * @param _owner refers to the owner of the contract.
         */
        function initialize(address _owner) public initializer
        {
            Ownable.initialize(_owner);
        }
    
        /**
         * @notice Register DID attributes.
         *
         * @dev The first attribute of a DID registered sets the DID owner.
         *      Subsequent updates record _checksum and update info.
         *
         * @param _did refers to decentralized identifier (a bytes32 length ID).
         * @param _checksum includes a one-way HASH calculated using the DDO content.
         * @param _value refers to the attribute value, limited to 2048 bytes.
         * @return the size of the registry after the register action.
         */
        function registerAttribute(bytes32 _did, bytes32 _checksum, address[] memory _providers, string memory _value, uint256 _price)
            public
            returns (uint size)
        {
            require(
                didRegisterList.didRegisters[_did].owner == address(0x0) ||
                didRegisterList.didRegisters[_did].owner == msg.sender,
                'Attributes must be registered by the DID owners.'
            );
    
            require(
                //TODO: 2048 should be changed in the future
                bytes(_value).length <= 2048,
                'Invalid value size'
            );
    
            uint updatedSize = didRegisterList.update(_did, _checksum);
    
            // push providers to storage
            for (uint256 i = 0; i < _providers.length; i++) {
                didRegisterList.addProvider(
                    _did,
                    _providers[i]
                );
    
            }
    
            addDIDPrice(_did, _price)
            /* emitting _value here to avoid expensive storage */
            emit DIDAttributeRegistered(
                _did,
                didRegisterList.didRegisters[_did].owner,
                _checksum,
                _value,
                msg.sender,
                block.number,
                _didPrice
                
            );
    
         s   return updatedSize;
        }
    
    
        function addDIDPrice(bytes32 _did, uint256 _didPrice) privte {
                DIDPrices[did] = _didPrice;
        }        
} 