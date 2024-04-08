import {useEffect} from "react";
import {loadMicrofrontend} from "./loadMicrofrontend";

export const mountMicrofrontend = (name, containerId, ref, history, additionalConfig = {}) => {
    useEffect(() => {
        loadMicrofrontend(name, containerId)
            .then(mountFn => {
                if (typeof mountFn === 'function') {
                    const {onParentNavigate} = mountFn(ref.current, {
                        initialPath: history.location.pathname,
                        onNavigate: ({pathname: nextPathname}) => {
                            const {pathname} = history.location;
                            if (pathname !== nextPathname) {
                                history.push(nextPathname);
                            }
                        },
                        ...additionalConfig,
                    });
                    history.listen(onParentNavigate);
                }
            })
            .catch(error => {
                console.error(`Failed to load or mount ${name} microfrontend`, error);
            });
    }, [ref, history, additionalConfig]);
};
