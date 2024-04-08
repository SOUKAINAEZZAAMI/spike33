import React, {useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {mountMicrofrontend} from '../utils/mountMicrofrontendHelper';

const DashboardApp = () => {
    const ref = useRef(null);
    const history = useHistory();

    mountMicrofrontend('dashboard', 'dashboardContainer', ref, history);

    return <div ref={ref} id="dashboardContainer"></div>;
};

export default DashboardApp;


/*import { mount } from 'dashboard/DashboardApp';
import React, { useRef, useEffect } from 'react';
export default () => {
    const ref = useRef(null);
    useEffect(() => {
    mount(ref.current);
    }, []);
    return <div ref={ref} />;
    };
    */