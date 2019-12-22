import React, { Component } from 'react'
import Route from '../components/templates/Route'
import Button from '../components/atoms/Button'

class NotFound extends Component {
    public render() {
        return <Route title="Consume">
            <h3>Copy Code and Paste on HTML </h3>
            <code>
Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis iusto consequatur nemo corrupti eos illum, velit facilis maxime consequuntur inventore quibusdam quae, ducimus autem in. Sed perferendis laudantium distinctio dolor.            </code>

            <div style={{ float: 'left', marginTop: '2rem', display: 'block' }}>
                <div style={{margin: '100px', display: 'inline'}}>
                    <Button primary>Publish Data</Button>
                </div>
                    <Button primary>Download</Button>
            </div>

        </Route>
    }
}

export default NotFound
