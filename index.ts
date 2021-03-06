
// DOMUSTO
import config from '../../config';
import DomustoPlugin from '../../domusto/DomustoPlugin';

// INTERFACES
import { Domusto } from '../../domusto/DomustoTypes';

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

    private pushBulletInstances = [];

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

        this.pluginConfiguration = pluginConfiguration;

        const isConfigurationValid = this.validateConfigurationAttributes(pluginConfiguration.settings, [
            {
                attribute: 'accessTokens',
                type: 'object'
            }
        ]);

        if (isConfigurationValid) {

            // Create a new PushBullet instance for each access token
            pluginConfiguration.settings.accessTokens.forEach(token => {
                this.pushBulletInstances.push(new PushBullet(token));
            });

            this.console.header(`${pluginConfiguration.id} plugin ready for sending / receiving data`);

        }

    }

    /**
     * Executed when a signal is received for this plugin
     *
     * @param {Domusto.Signal} signal
     * @memberof DomustoShell
     */
    onSignalReceivedForPlugin(signal: Domusto.Signal) {

        switch (signal.deviceId) {
            case 'note':
                this.sendNoteToAll(signal.data['title'], signal.data['message']);
                break;
            case 'link':
            case 'file':
            default:
                this.console.error('No Pushbullet action defined for ', signal.deviceId);
                break;
        }

    }

    /**
     * Push message to all subscribed api keys
     *
     * @param {string} title Message title
     * @param {string} message Message content
     * @memberof DomustoPushBullet
     */
    sendNoteToAll(title: string, message: string) {

        this.pushBulletInstances.forEach(instance => {
            instance.note('', title, message);
        });

    }
}

export default DomustoPushBullet;