import React from 'react'
import styles from './Asset.module.scss'

const AssetLink = ({ asset }: { asset: any }) => {


    return (
        <div className="card" style={{ width: '18rem', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 10px 30px' }}>

            <div style={{ background: 'black' }}>
                <img className="card-img-top" style={{ height: '230px' }} src="https://commons.oceanprotocol.com/static/media/jellyfish-grid.b467b9d7.svg" alt="Card image cap" />
            </div>
            <div className="card-body" style={{ padding: '30px' }}>
                <h5 className="card-title">{asset.name}</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">More Details</a>
            </div>

        </div>

    )

}

export default AssetLink
