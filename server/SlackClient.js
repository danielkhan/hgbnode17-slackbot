'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;


class SlackClient {

    constructor(token, nlp, botname, logLevel, log, serviceRegistry) {
        this._rtm = new RtmClient(token, {logLevel: logLevel});
        this._log = log;
        this._nlp = nlp;
        this._botname = botname;
        this._registry = serviceRegistry;
    }

    _handleOnMessage(message) {

        if(message.text && message.text.toLowerCase().includes(this._botname)) {

            this._nlp.ask(message.text, (err, res) => {
                
                if(err) {
                    this._log.fatal(err);
                    return;
                }


                try {
                    if(!res.intent || !res.intent[0] || !res.intent[0].value) {
                        throw new Error("Could not extract intent");
                    }

                    const intent = require('./intents/' + res.intent[0].value + 'Intent');

                    intent.process(res, this._registry, this._log, (error, response) => {
                        if(error) {
                            this._log.fatal(error.message);
                            return;
                        }

                        return this._rtm.sendMessage(response, message.channel);
                    });
                } catch(err) {
                    this._log.info(err);
                    this._log.info(res);
                    return this._rtm.sendMessage("I don't know what you are talking about");
                }
            });   
        }
    }

    _handleOnAuthenticated(rtmStartData) {
        this._log.info(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
    }

    _addAuthenticatedHandler(handler) {
        this._rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler.bind(this));
    }

    start(handler) {
        this._addAuthenticatedHandler(handler);
        this._addAuthenticatedHandler(this._handleOnAuthenticated);
        this._rtm.on(RTM_EVENTS.MESSAGE, this._handleOnMessage.bind(this));
        this._rtm.start();
    }

}

module.exports = SlackClient;