// App component  accept a {history} as a prop which will pass from bootstrap.js
import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import {
    StylesProvider,
    createGenerateClassName,
    } from '@material-ui/core/styles';
    import Landing from './components/Landing';
    import Pricing from './components/Pricing';
    export default ({ history }) => {
    return (
    <div>
    <StylesProvider>
    <Router history={history}>
    <Switch>
    <Route exact path="/pricing" component={Pricing} />
    <Route path="/" component={Landing} />
    </Switch>
    </Router>
    </StylesProvider>
    </div>
    );
    };
 


/*
import React from 'react';
import { Switch, Route, BrowserRouter } from
'react-router-dom';
import { StylesProvider } from
'@material-ui/core/styles';
import Landing from './components/Landing';
import Pricing from './components/Pricing';
export default () => {
return (
<div>
<StylesProvider>
<BrowserRouter>
<Switch>
<Route exact path="/pricing"
component={Pricing} />
<Route path="/" component={Landing} />
</Switch>
</BrowserRouter>
</StylesProvider>
</div>
);
};   */