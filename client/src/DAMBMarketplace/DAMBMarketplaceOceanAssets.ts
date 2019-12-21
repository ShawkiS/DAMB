import { DDO } from '@oceanprotocol/squid/dist/node/ddo/DDO'
import { MetaData } from '@oceanprotocol/squid/dist/node/ddo/MetaData'
import { Service } from '@oceanprotocol/squid/dist/node/ddo/Service'
import Account from '@oceanprotocol/squid/dist/node/ocean/Account'
import DID from '@oceanprotocol/squid/dist/node/ocean/DID'
import {DAMBMarketplaceServices} from '../DAMBMarketplace/DAMBMarketplaceServices'

import {
  fillConditionsWithDDO,
  SubscribablePromise
} from '@oceanprotocol/squid/dist/node/utils'
import {
  Instantiable,
  InstantiableConfig
} from '@oceanprotocol/squid/dist/node/Instantiable.abstract'

import { zeroX, noZeroX, didPrefixed, didZeroX } from '@oceanprotocol/squid/dist/node/utils'


/**
 * Assets submodule of Ocean Protocol.
 */
export class OceanAssets extends Instantiable {
  /**
   * Returns the instance of OceanAssets.
   * @return {Promise<OceanAssets>}
   */
  public static async getInstance (
    config: InstantiableConfig
  ): Promise<OceanAssets> {
    const instance = new OceanAssets()
    instance.setInstanceConfig(config)

    return instance
  }

  /**
   * Returns a DDO by DID.
   * @param  {string} did Decentralized ID.
   * @return {Promise<DDO>}
   */
  public async resolve (did: string): Promise<DDO> {
    const {
      serviceEndpoint
    } = await this.ocean.keeper.didRegistry.getAttributesByDid(did)
    return this.ocean.aquarius.retrieveDDOByUrl(serviceEndpoint)
  }

  /**
   * Creates a new DDO.
   * @param  {MetaData} metadata DDO metadata.
   * @param  {Account} publisher Publisher account.
   * @return {Promise<DDO>}
   */
  public create (
    metadata: MetaData,
    publisher: Account,
    services: Service[] = []
  ): SubscribablePromise<0, DDO> {
    this.logger.log('Creating asset')
    return new SubscribablePromise(async () => {
      const { secretStoreUri } = this.config
      const { didRegistry, templates } = this.ocean.keeper

      const did: DID = DID.generate()

      this.logger.log('Encrypting files')

      const encryptedFiles = await this.ocean.secretStore.encrypt(
        did.getId(),
        metadata.main.files,
        publisher
      )
      this.logger.log('Files encrypted')

      const serviceAgreementTemplate = await templates.escrowAccessSecretStoreTemplate.getServiceAgreementTemplate()

      const serviceEndpoint = this.ocean.aquarius.getServiceEndpoint(did)

      let indexCount = 0
      // create ddo itself
      const ddo: DDO = new DDO({
        id: did.getDid(),
        authentication: [
          {
            type: 'RsaSignatureAuthentication2018',
            publicKey: did.getDid()
          }
        ],
        publicKey: [
          {
            id: did.getDid(),
            type: 'EthereumECDSAKey',
            owner: publisher.getId()
          }
        ],
        service: [
          {
            type: 'access',
            serviceEndpoint: this.ocean.brizo.getConsumeEndpoint(),
            templateId: templates.escrowAccessSecretStoreTemplate.getAddress(),
            attributes: {
              main: {
                creator: publisher.getId(),
                datePublished: metadata.main.datePublished,
                name: 'dataAssetAccessServiceAgreement',
                price: metadata.main.price,
                timeout: 3600
              },
              serviceAgreementTemplate
            }
          },
          {
            type: 'authorization',
            service: 'SecretStore',
            serviceEndpoint: secretStoreUri,
            attributes: { main: {} }
          },
          {
            type: 'metadata',
            serviceEndpoint,
            attributes: {
              // Default values
              curation: {
                rating: 0,
                numVotes: 0
              },
              // Overwrites defaults
              ...metadata,
              encryptedFiles,
              // Cleaning not needed information
              main: {
                ...metadata.main,
                files: metadata.main.files.map((file, index) => ({
                  ...file,
                  index,
                  url: undefined
                }))
              } as any
            }
          },
          ...services
        ]
          // Remove duplications
          .reverse()
          .filter(
            ({ type }, i, list) =>
              list.findIndex(({ type: t }) => t === type) === i
          )
          .reverse()
          // Adding index
          .map(_ => ({
            ..._,
            index: indexCount++
          })) as Service[]
      })

      // Overwrite initial service agreement conditions
      const rawConditions = await templates.escrowAccessSecretStoreTemplate.getServiceAgreementTemplateConditions()
      const conditions = fillConditionsWithDDO(rawConditions, ddo)
      serviceAgreementTemplate.conditions = conditions

      this.logger.log('Generating proof')

      await ddo.addProof(this.ocean, publisher.getId(), publisher.getPassword())
      this.logger.log('Proof generated')

      this.logger.log('Registering DID')

      await didRegistry.registerAttribute(
        zeroX(did.getId()),
        zeroX(ddo.getChecksum()),
        ['0x4aaab179035dc57b35e2ce066919048686f82972'].map(zeroX),
        serviceEndpoint,
        publisher.getId()
      )

      this.logger.log('DID registred')

      this.logger.log('Storing DDO')

      const storedDdo = await this.ocean.aquarius.storeDDO(ddo)
      this.logger.log('DDO stored')

      return storedDdo
    })
  }
}
