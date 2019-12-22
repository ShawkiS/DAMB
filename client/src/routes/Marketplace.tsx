import React, { Component } from 'react'
import Route from '../components/templates/Route'
import styles from './Search.module.scss'
import Spinner from '../components/atoms/Spinner'
import Asset from '../components/molecules/Asset'


class Marketplace extends Component {

    public state = {
        results: [{ id: 1, name: "Name", datePublished: "sasasa" }, { id: 1, name: "Name", datePublished: "sasasa" }, { id: 1, name: "Name", datePublished: "sasasa" }],
        isLoading: true
    }
    public componentDidMount() {
        this.setState({
            isLoading: false
        })
    }


    public render() {
        return <Route title={'Marketplace'}>
            <div className={styles.results}>
                            <Asset asset={{ name: 'card name' }} />
                            <Asset asset={{ name: 'card name' }} />
                            <Asset asset={{ name: 'card name' }} />
                            <Asset asset={{ name: 'card name' }} />
                            <Asset asset={{ name: 'card name' }} />
                            <Asset asset={{ name: 'card name' }} />
                            <Asset asset={{ name: 'card name' }} />
                            <Asset asset={{ name: 'card name' }} />
                            <Asset asset={{ name: 'card name' }} />
                            <Asset asset={{ name: 'card name' }} />


            </div>
        </Route>
    }
}

export default Marketplace
