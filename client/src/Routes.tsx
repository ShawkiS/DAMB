import React from 'react'
import { Route, Switch } from 'react-router-dom'
import withTracker from './withTracker'

import About from './routes/About'
import Home from './routes/Home'
import NotFound from './routes/NotFound'
import Search from './routes/Search'
import Styleguide from './routes/Styleguide'
import Publish from "./routes/Publish";
import Consume from "./routes/Consume";
import Marketplace from "./routes/Marketplace";

const Routes = () => (
    <Switch>
        <Route exact component={withTracker(Home)} path="/" />
        <Route component={withTracker(Publish)} path="/publish" />
        <Route component={withTracker(Consume)} path="/consume" />
        <Route component={withTracker(Marketplace)} path="/Marketplace" />
        <Route component={withTracker(Styleguide)} path="/styleguide" />
        <Route component={withTracker(About)} path="/about" />
        <Route component={withTracker(Search)} path="/search" />
        <Route component={withTracker(History)} path="/history" />
        <Route component={withTracker(NotFound)} />
    </Switch>
)

export default Routes
