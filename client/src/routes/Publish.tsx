import Route from '../components/templates/Route'
import React, { Component } from 'react'
import { site } from '../site.config'
import styles from './index.module.css'
import Add from "../components/organisms/Add";


class Publish extends Component {
    public render() {

        return (
            <div style={{
                
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                padding: 'calc(var(--spacer) * 2)',
                borderRadius: 'var(--border-radius)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                paddingRight: '25px',
                paddingLeft: '25px',
                marginRight: '350px',
                marginLeft: '350px'
            }}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{site.title}</h1>
                    <p className={styles.description}>{site.description}</p>
                </header>
                <Add />
            </div>
        );
    }
}

export default Publish
