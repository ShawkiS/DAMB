import React, { useState, useEffect } from 'react'
import useIpfsApi, { IpfsConfig } from '../../hooks/use-ipfs-api'
import { formatBytes, addToIpfs } from '../../utils'
import { site } from '../../site.config'
import Dropzone from '../atoms/Dropzone'
import styles from './Add.module.css'
import Spinner from '../atoms/Spinner'
import Button from '../atoms/Button'
import Input from '../atoms/Form/Input'

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
      <div style={{ marginTop: '2rem' }} className={styles.buttons}>
        <Button primary>Publish Data</Button>
      </div>
    </div>
  )
}
