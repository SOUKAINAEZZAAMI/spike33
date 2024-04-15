import React from 'react';
import ReactDOM from 'react-dom';
import { createMemoryHistory, createBrowserHistory } from 'history';
import App from './App';
// Mount function to start up the app
// Mount function to start up the app
const mount = (el, { onNavigate, defaultHistory, initialPath }) => {
    const history =
    defaultHistory ||
    createMemoryHistory({
    initialEntries: [initialPath],
    });
    if (onNavigate) {
    history.listen(onNavigate);
    }
    ReactDOM.render(<App history={history} />, el);
    return {
        onParentNavigate({ pathname: nextPathname }) {
        const { pathname } = history.location;
        if (pathname !== nextPathname) {
        history.push(nextPathname);
        }
        },
        };
        };    

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
const devRoot = document.querySelector('#_marketing-dev-root');
if (devRoot) {
mount(devRoot, { defaultHistory: createBrowserHistory() });
}
}
// We are running through container
// and we should export the mount function
export { mount };


/*
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// Mount function to start up the app
const mount = (el) => {
    ReactDOM.render(<App />, el);
    };
    
    if (process.env.NODE_ENV === 'development') {
        const devRoot =
        document.querySelector('#_marketing-dev-root');
        if (devRoot) {
        mount(devRoot);
        }
        }
        // We are running through container
        // and we should export the mount function
        export { mount };*/

/*import React from 'react';
import ReactDOM from 'react-dom';
// Mount function to start up the app
const mount = (el) => {
ReactDOM.render(<h1>Hi there!</h1>, el);
};
// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
const devRoot =
document.querySelector('#_marketing-dev-root');
if (devRoot) {
mount(devRoot);
}
}
// We are running through container
// and we should export the mount function
export { mount };*/
