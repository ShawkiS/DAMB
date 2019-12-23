import React, { useState, useEffect } from 'react'
import useIpfsApi, { IpfsConfig } from '../../hooks/use-ipfs-api'
import { formatBytes, addToIpfs } from '../../utils'
import { site } from '../../site.config'
import Dropzone from '../atoms/Dropzone'
import styles from './Add.module.css'
import Spinner from '../atoms/Spinner'
import Button from '../atoms/Button'
import Input from '../atoms/Form/Input'
import { Ocean } from '@oceanprotocol/squid'

const { hostname, port, protocol } = new URL(site.ipfsNodeUri)

const ipfsConfig: IpfsConfig = {
  protocol: protocol.replace(':', ''),
  host: hostname,
  port: port || '443'
}

export default function Add() {


  const { ipfs, isIpfsReady, ipfsError } = useIpfsApi(ipfsConfig)
  const [fileHash, setFileHash] = useState()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState()
  const [error, setError] = useState()
  const [fileSize, setFileSize] = useState()
  const [fileSizeReceived] = useState('')

  useEffect(() => {
    setMessage(
      `Adding to IPFS<br />
       <small>${fileSizeReceived || 0}/${fileSize}</small><br />`
    )
  }, [fileSize, fileSizeReceived])

  async function handleOnDrop(acceptedFiles: File[]) {
    if (!acceptedFiles[0]) return

    setLoading(true)
    setError(null)

    const totalSize = formatBytes(acceptedFiles[0].size, 0)
    setFileSize(totalSize)

    try {
      const cid = await addToIpfs(acceptedFiles, ipfs)
      if (!cid) return
      setFileHash(cid)
      setLoading(false)
    } catch (error) {
      setError(`Adding to IPFS failed: ${error.message}`)
      return null
    }
  }

  function Submit(name: string, price: string, ipfsUrl: string) {
    const asset = {
      main: {
        name: name,
        dateCreated: Date.now.toString(),
        author: 'DAMP Marketplace + address',
        type: 'file',
        license: 'CC0: Public Domain',
        price: price,
        files: [
          {
            index: 0,
            contentType: 'application/zip',
            checksum: '2bf9d229d110d1976cdf85e9f3256c7f',
            checksumType: 'MD5',
            contentLength: '12057507',
            compression: 'zip',
            encoding: 'UTF-8',
            url:
            ipfsUrl
          }
        ]
      },
      additionalInformation: {
        categories: ['Biology'],
        tags: ['image data', 'classification', 'animals'],
        description: 'EXAMPLE ONLY ',
        copyrightHolder: 'Unknown',
        workExample: 'image path, id, label',
        links: [
          {
            name: 'example model',
            url:
              'https://drive.google.com/open?id=1uuz50RGiAW8YxRcWeQVgQglZpyAebgSM'
          }
        ],
        inLanguage: 'en'
      }
    }
  }

  return (
    <div className={styles.add}>

      <div className={styles.topDiv}>
        <Input
          key={'Name'}
          name={'Name'}
          label={'Asset Name'}
          placeholder={'Enter The Name Of Your Asset'}
          required={true}
          type={'text'}
        />
      </div>

      <div className={styles.topDiv}>
        <Input
          key={'Description'}
          name={'Description'}
          label={'Asset Description'}
          placeholder={'Enter The Description Of Your Asset'}
          required={true}
          type={'text area'}
        />
      </div>


      <div className={styles.lastInputDiv}>
        <Input
          key={'price'}
          name={'price'}
          label={'Asset price'}
          placeholder={'Enter The Price Of Your Asset'}
          required={true}
          type={'number'}
        />
      </div>

      {loading ? (
        <Spinner message={message} />
      ) : fileHash ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${site.ipfsGateway}/ipfs/${fileHash}`}
        >
          ipfs://{fileHash}
        </a>
      ) : (
            <div style={{ width: '100%' }}>
              <Dropzone

                multiple={false}
                handleOnDrop={handleOnDrop}
                disabled={!isIpfsReady}
                error={error || ipfsError}
              />
            </div>
          )}
      <div onClick={() => Submit()} style={{ marginTop: '2rem' }} className={styles.buttons}>
        <Button primary>Publish Data</Button>
      </div>
    </div>
  )
}
