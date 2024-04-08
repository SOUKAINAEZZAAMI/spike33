export const loadMicrofrontend = async (name, containerId) => {
    return new Promise(async (resolve, reject) => {
        const response = await fetch('/mf-metadata.json');
        const microfrontends = await response.json();

        const metadata = microfrontends.find(mf => mf.name === name);
        if (!metadata) {
            return reject(`Microfrontend with name ${name} not found`);
        }

        if (document.querySelector(`script[src="${metadata.remoteEntryUrl}"]`)) {
            return resolve(window[name].mount);
        }
        const script = document.createElement('script');
        script.src = metadata.remoteEntryUrl;
        script.onload = async () => {
            await window[name].init(__webpack_share_scopes__.default);

            window[name].get(`./${name.charAt(0).toUpperCase() + name.slice(1)}App`).then((factory) => {
                const Module = factory();

                return resolve(Module.mount);
            }).catch(reject);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
};
