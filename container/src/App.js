import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import {
StylesProvider,
createGenerateClassName,
} from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import Header from './components/Header';
const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
//const DashboardLazy = lazy(() => import('./components/DashboardApp'));
const generateClassName = createGenerateClassName({
productionPrefix: 'co',
});
const history = createBrowserHistory();
export default () => {
const [isSignedIn, setIsSignedIn] = useState(false);
useEffect(() => {
if (isSignedIn) {
//history.push('/dashboard');
}
}, [isSignedIn]);
return (
<Router history={history}>
<StylesProvider generateClassName={generateClassName}>
<div>
<Header
onSignOut={() => setIsSignedIn(false)}
isSignedIn={isSignedIn}
/>
<Suspense fallback={<div>Loading....</div>}>
<Switch>
<Route path="/auth">
<AuthLazy onSignIn={() => setIsSignedIn(true)} />
</Route>

<Route path="/" component={MarketingLazy} />
</Switch>
</Suspense>
</div>
</StylesProvider>
</Router>
);
};
/*import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
StylesProvider,
createGenerateClassName,
} from '@material-ui/core/styles';
import Header from './components/Header';
const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const generateClassName = createGenerateClassName({
productionPrefix: 'co',
});
export default () => {
const [isSignedIn, setIsSignedIn] = useState(false);
return (
<BrowserRouter>
<StylesProvider generateClassName={generateClassName}>
<div>
<Header
onSignOut={() => setIsSignedIn(false)}
isSignedIn={isSignedIn}
/>
<Suspense fallback={<div>Loading....</div>}>
<Switch>
<Route path="/auth">
<AuthLazy onSignIn={() => setIsSignedIn(true)} />
</Route>
<Route path="/" component={MarketingLazy} />
</Switch>
</Suspense>
</div>
</StylesProvider>
</BrowserRouter>
);
};*/

/*
//. Lazy loading

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
StylesProvider,
createGenerateClassName,
} from '@material-ui/core/styles';
import Header from './components/Header';
const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const generateClassName = createGenerateClassName({
productionPrefix: 'co',
});
export default () => {
return (
<BrowserRouter>
<StylesProvider generateClassName={generateClassName}>
<div>
<Header />
<Suspense fallback={<div>Loading....</div>}>
<Switch>
<Route path="/auth" component={AuthLazy} />
<Route path="/" component={MarketingLazy} />
</Switch>
</Suspense>
</div>
</StylesProvider>
</BrowserRouter>
);
};

*/
/*import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
StylesProvider,
createGenerateClassName,
} from '@material-ui/core/styles';
import MarketingApp from './components/MarketingApp';
import AuthApp from './components/AuthApp';
import Header from './components/Header';
const generateClassName = createGenerateClassName({
productionPrefix: 'co',
});
export default () => {
return (
<BrowserRouter>
<StylesProvider generateClassName={generateClassName}>
<div>
<Header />
<Switch>
<Route path="/auth" component={AuthApp} />
<Route path="/" component={MarketingApp} />
</Switch>
</div>
</StylesProvider>
</BrowserRouter>
);
};*/