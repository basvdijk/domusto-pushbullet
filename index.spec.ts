import DomustoPushBullet from './';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

// DOMUSTO
import DomustoPlugin from '../../domusto/DomustoPlugin';
import { Domusto } from '../../domusto/DomustoInterfaces';

describe('Plugin DomustoPushBullet', () => {

    let DomustoPushBulletProxy;
    let DomustoPluginProxy;
    let broadcastSignalSpy;
    let sendNoteToAllSpy;
    let noteSpy;

    let PushBulletPluginInstance;

    beforeEach(() => {

        broadcastSignalSpy = sinon.spy(DomustoPlugin.prototype, 'broadcastSignal');

        noteSpy = sinon.spy();

        let PushBulletStub = sinon.stub().returns({
            note: noteSpy
        });

        DomustoPushBulletProxy = proxyquire('./index', {
            'pushbullet': PushBulletStub,
        });

        PushBulletPluginInstance = new DomustoPushBulletProxy.default({
            id: 'PushBullet',
            enabled: true,
            dummyData: false,
            debug: true,
            settings: {
                apiKeys: [
                    'v1Kls34hjsdhfs8f32h4dfghkdjJSDFj',
                    '9834jKDFJ92ijjkldfj2JDO29jkasdfj'
                ]
            }
        });

        sendNoteToAllSpy = sinon.spy(PushBulletPluginInstance, 'sendNoteToAll');
    });

    afterEach(() => {
        broadcastSignalSpy.restore();
    });

    it('should send a push message when signal received', () => {

        let signal: Domusto.Signal = {
            pluginId: 'PUSHBULLET',
            sender: Domusto.SignalSender.client,
            deviceId: 'note',
            data: {
                title: 'test message',
                message: 'This is a test'
            }
        };

        PushBulletPluginInstance.onSignalReceivedForPlugin(signal);
        sinon.assert.calledWith(sendNoteToAllSpy, 'test message', 'This is a test');
    });

    it('should send a push message to all provided api keys', () => {

        let signal: Domusto.Signal = {
            pluginId: 'PUSHBULLET',
            sender: Domusto.SignalSender.client,
            deviceId: 'note',
            data: {
                title: 'test message',
                message: 'This is a test'
            }
        };

        PushBulletPluginInstance.onSignalReceivedForPlugin(signal);

        sinon.assert.calledTwice(noteSpy);

    });

});