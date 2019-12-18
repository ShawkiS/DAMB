/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { IpfsConfig } from '../../../hooks/use-ipfs-api'
import Spinner from '../../atoms/Spinner/Spinner'
import Dropzone from '../../molecules/Dropzone/Dropzone'
import {ipfsNodeUri } from '../../../config'
import Form from './Form'

export default function Ipfs() {
    const { hostname, port, protocol } = new URL(ipfsNodeUri)

    const ipfsConfig: IpfsConfig = {
        protocol: protocol.replace(':', ''),
        host: hostname,
        port: port || '443'
    }

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [fileSize, setFileSize] = useState('')
    const [fileSizeReceived] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        setMessage(
            `Adding to IPFS<br />
             <small>${fileSizeReceived || 0}/${fileSize}</small><br />`
        )
    }, [fileSize, fileSizeReceived])

    async function addToIpfs(data: any) {
 
    }

    async function handleOnDrop(acceptedFiles: any) {
        
    }

    return (
        <Form
            error={error}
            ipfsMessage={'ipfsMessage'}
            ipfsError={''}
            isIpfsReady={true}
        >
            {loading ? (
                <Spinner message={message} />
            ) : (
                <Dropzone
                    multiple={false}
                    handleOnDrop={handleOnDrop}
                    disabled={!true}
                />
            )}
        </Form>
    )
}
