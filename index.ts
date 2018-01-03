import util from '../../util';
import config from '../../config';

// DOMUSTO
import DomustoPlugin from '../../domusto/DomustoPlugin';

// INTERFACES
import { Domusto } from '../../domusto/DomustoInterfaces';

// PLUGIN SPECIFIC
import * as PushBullet from 'pushbullet';

/**
 * Shell plugin for DOMUSTO
 * @author Bas van Dijk
 * @version 0.0.1
 *
 * @class DomustoPushBullet
 * @extends {DomustoPlugin}
 */
class DomustoPushBullet extends DomustoPlugin {

    private _pushBulletInstances = [];

    /**
     * Creates an instance of DomustoPushBullet.
     * @param {any} Plugin configuration as defined in the config.js file
     * @memberof DomustoPushBullet
     */
    constructor(pluginConfiguration: Domusto.PluginConfiguration) {

        super({
            plugin: 'Pushbullet executer',
            author: 'Bas van Dijk',
            category: Domusto.PluginCategories.push,
            version: '0.0.1',
            website: 'http://domusto.com'
        });

        pluginConfiguration.settings.apiKeys.forEach(key => {
            this._pushBulletInstances.push(new PushBullet(key));
        });

        util.header('Pushbullet ready for sending data');

    }

    sendMessageToAll(title: string, message: string) {

        this._pushBulletInstances.forEach(instance => {
            instance.note('', title, message);
        });

    }
}

export default DomustoPushBullet;