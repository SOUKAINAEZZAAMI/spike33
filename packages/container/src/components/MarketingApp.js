import React, {useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {mountMicrofrontend} from '../utils/mountMicrofrontendHelper';

const MarketingApp = () => {
    const history = useHistory();
    const ref = useRef(null);

    mountMicrofrontend('marketing', 'marketingContainer', ref, history);

    return <div ref={ref} id="marketingContainer"></div>;
};

export default MarketingApp;
