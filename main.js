'use strict';

/*
 * Created with @iobroker/create-adapter v1.34.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");
const puppeteer = require('puppeteer');

let browser;

class Template extends utils.Adapter {

    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'pupeteer_sma',
        });
        this.on('ready', this.onReady.bind(this));
        // this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        //
        //
        // const browser = await puppeteer.launch({
        //     // args: ["--enable-features=NetworkService", "--no-sandbox"],
        //     // ignoreHTTPSErrors: true,
        //     executablePath: '/usr/bin/chromium-browser',
        //     pipe: true
        // });
        // this.log.info(`browser launched`);
        // const page = await browser.newPage();
        // this.log.info(`newPage opened`);
        //
        // await page.setRequestInterception(true);
        // this.log.info(`page.setRequestInterception`);
        //
        // page.once("request", interceptedRequest => {
        // this.log.info(`page request`);
        //     interceptedRequest.continue({
        //         method: "POST",
        //         postData: JSON.stringify({
        //                             right: "usr",
        //                             pass: this.config.sma_pass
        //                         }),
        //         headers: {
        //             ...interceptedRequest.headers(),
        //             "Content-Type": "application/x-www-form-urlencoded"
        //         }
        //     });
        // });
        //
        // const response = await page.goto(this.config.sma_url);
        // this.log.info(`got response`);
        //
        // this.log.info({
        //     url: response.url(),
        //     statusCode: response.status(),
        //     body: await response.text()
        // });
        //
        // await browser.close();
        
        
        this.log.error(`adapter onReady`);
        try {
            // Initialize your adapter here

            // The adapters config (in the instance object everything under the attribute "native") is accessible via
            // this.config:

            //new Pupeteer -> login to get sid
            // Create browser instance, and give it a first tab
            // const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});
            // this.log.info(`pupeteer browser launched`);
            //
            // const page = await browser.newPage();
            // this.log.info(`new Page init done`);


            browser = await puppeteer.launch({
                executablePath: '/usr/bin/chromium-browser',
                headless: true,
                pipe: true,
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--deterministic-fetch',
                    '--disable-features=IsolateOrigins',
                    '--disable-site-isolation-trials',
                    // '--single-process',
                ],
                // args: [
                //     '--no-sandbox',
                //     '--disable-setuid-sandbox',
                //     '--disable-dev-shm-usage',
                //     '--single-process'
                // ]
            });
            this.log.info(`pupeteer browser launched`);

            const page = await browser.newPage();
            this.log.info(`new Page init done`);

            await page.goto(this.config.sma_url);

            // Allows you to intercept a request; must appear before
            // your first page.goto()
            await page.setRequestInterception(true);

            // Request intercept handler... will be triggered with
            // each page.goto() statement
            page.on('request', interceptedRequest => {

                // Here, is where you change the request method and
                // add your post data
                var data = {
                    'method': 'POST',
                    'postData': JSON.stringify({
                        right: "usr",
                        pass: this.config.sma_pass
                    })
                };

                this.log.info(`pupeteer send data: "${JSON.stringify(data)}"`);

                // Request modified... finish sending!
                interceptedRequest.continue(data);
            });

            // Navigate, trigger the intercept, and resolve the response
            const response = await page.goto(this.config.sma_url);
            const responseBody = await response.text();

            this.log.info(`response: "${JSON.stringify(responseBody)}"`);
            await browser.close();
        } catch (e) {
            this.log.error(`error: "${e.toString()}"`);
        }

        /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        */
        /*
        await this.setObjectNotExistsAsync('testVariable', {
            type: 'state',
            common: {
                name: 'testVariable',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: true,
            },
            native: {},
        });
        */

        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates('lights.*');
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates('*');

        /*
            setState examples
            you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        */
        /*
        // the variable testVariable is set to true as command (ack=false)
        await this.setStateAsync('testVariable', true);

        // same thing, but the value is flagged "ack"
        // ack should be always set to true if the value is received from or acknowledged from the target system
        await this.setStateAsync('testVariable', { val: true, ack: true });

        // same thing, but the state is deleted after 30s (getState will return null afterwards)
        await this.setStateAsync('testVariable', { val: true, ack: true, expire: 30 });
        */

        // examples for the checkPassword/checkGroup functions
        /*
        let result = await this.checkPasswordAsync('admin', 'iobroker');
        this.log.info('check user admin pw iobroker: ' + result);

        result = await this.checkGroupAsync('admin', 'admin');
        this.log.info('check group user admin group admin: ' + result);
        */
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);
    
            browser.close();
            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  * @param {string} id
    //  * @param {ioBroker.Object | null | undefined} obj
    //  */
    // onObjectChange(id, obj) {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    // onStateChange(id, state) {
    //     if (state) {
    //         // The state was changed
    //         this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    //         try {
    //             this.log.info(`send message to Discord "${state.val}"`);
    //             //Do something when a state changes
    //         } catch (e) {
    //             this.log.info(`could not send message "${state.val}"`);
    //         }
    //     } else {
    //         // The state was deleted
    //         this.log.info(`state ${id} deleted`);
    //     }
    // }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  * @param {ioBroker.Message} obj
    //  */
    // onMessage(obj) {
    //     if (typeof obj === 'object' && obj.message) {
    //         if (obj.command === 'send') {
    //             // e.g. send email or pushover or whatever
    //             this.log.info('send command');

    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
    //         }
    //     }
    // }

}

if (require.main !== module) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new Template(options);
} else {
    // otherwise start the instance directly
    new Template();
}
