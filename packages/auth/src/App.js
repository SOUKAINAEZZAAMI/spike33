import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import {
StylesProvider,
} from '@material-ui/core/styles';
import Signin from './components/Signin';
import Signup from './components/Signup';
export default ({ history, onSignIn }) => {
return (
<div>
<StylesProvider>
<Router history={history}>
<Switch>
<Route path="/auth/signin">
<Signin onSignIn={onSignIn} />
</Route>
<Route path="/auth/signup">
<Signup onSignIn={onSignIn} />
</Route>
</Switch>
</Router>
</StylesProvider>
</div>
);
};
/*import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import {
StylesProvider,
createGenerateClassName,
} from '@material-ui/core/styles';
import Signin from './components/Signin';
import Signup from './components/Signup';
export default ({ history }) => {
return (
<div>
<StylesProvider>
<Router history={history}>
<Switch>
<Route path="/auth/signin" component={Signin} />
<Route path="/auth/signup" component={Signup} />
</Switch>
</Router>
</StylesProvider>
</div>
);
};*/
