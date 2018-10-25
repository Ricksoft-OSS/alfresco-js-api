/*!
 * @license
 * Copyright 2018 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AlfrescoAuthRestApi = require('./auth-rest-api/src/api/AuthenticationApi');
import LoginRequest = require('./auth-rest-api/src/model/LoginRequest');
import Emitter = require('event-emitter');
import { AlfrescoApiClient } from './alfrescoApiClient';
import { AlfrescoApiConfig } from './alfrescoApiConfig';
import { Storage } from './storage';

export class EcmAuth extends AlfrescoApiClient {

    config: AlfrescoApiConfig;
    basePath: string;
    ticketStorageLabel: string;
    storage: Storage;
    ticket: string;
    authentications: any;

    /**
     * @param {Object} config
     */
    constructor(config) {
        super();

        this.config = config;

        this.basePath = this.config.hostEcm + '/' + this.config.contextRoot + '/api/-default-/public/authentication/versions/1'; //Auth Call

        if (this.config.domainPrefix) {
            this.ticketStorageLabel = this.config.domainPrefix.concat('-ticket-ECM');
        } else {
            this.ticketStorageLabel = 'ticket-ECM';
        }

        if (this.config.ticketEcm) {
            this.setTicket(config.ticketEcm);
        } else if (this.storage.getItem(this.ticketStorageLabel)) {
            this.setTicket(this.storage.getItem(this.ticketStorageLabel));
        }

        Emitter.call(this);
    }

    changeHost() {
        this.basePath = this.config.hostEcm + '/' + this.config.contextRoot + '/api/-default-/public/authentication/versions/1'; //Auth Call
        this.ticket = undefined;
    }

    saveUsername(username) {
        if (this.storage.supportsStorage()) {
            this.storage.setItem('ACS_USERNAME', username);
        }
    }

    /**
     * login Alfresco API
     * @param  {String} username:   // Username to login
     * @param  {String} password:   // Password to login
     *
     * @returns {Promise} A promise that returns {new authentication ticket} if resolved and {error} if rejected.
     * */
    login(username, password): Promise<any> {
        this.authentications.basicAuth.username = username;
        this.authentications.basicAuth.password = password;

        let authApi = new AlfrescoAuthRestApi.AuthenticationApi(this);
        let loginRequest = new LoginRequest();

        loginRequest.userId = this.authentications.basicAuth.username;
        loginRequest.password = this.authentications.basicAuth.password;

        let promise: any = new Promise((resolve, reject) => {
            authApi.createTicket(loginRequest)
                .then((data) => {
                    this.saveUsername(username);
                    this.setTicket(data.entry.id);
                    promise.emit('success');
                    resolve(data.entry.id);
                })
                .catch((error) => {
                    this.saveUsername('');
                    if (error.status === 401) {
                        promise.emit('unauthorized');
                    } else if (error.status === 403) {
                        promise.emit('forbidden');
                    } else {
                        promise.emit('error');
                    }
                    reject(error);
                });
        });

        Emitter(promise); // jshint ignore:line
        return promise;
    }

    /**
     * validate the ticket present in this.config.ticket against the server
     *
     * @returns {Promise} A promise that returns  if resolved and {error} if rejected.
     * */
    validateTicket(): Promise<any> {
        let authApi = new AlfrescoAuthRestApi.AuthenticationApi(this);

        this.setTicket(this.config.ticketEcm);

        let promise: any = new Promise((resolve, reject) => {
            authApi.validateTicket().then(
                (data) => {
                    this.setTicket(data.entry.id);
                    promise.emit('success');
                    resolve(data.entry.id);
                },
                (error) => {
                    if (error.status === 401) {
                        promise.emit('unauthorized');
                    }
                    promise.emit('error');
                    reject(error);
                });
        });

        Emitter(promise); // jshint ignore:line
        return promise;
    }

    /**
     * logout Alfresco API
     *
     * @returns {Promise} A promise that returns { authentication ticket} if resolved and {error} if rejected.
     * */
    logout(): Promise<any> {
        this.saveUsername('');
        let authApi = new AlfrescoAuthRestApi.AuthenticationApi(this);

        let promise: any = new Promise((resolve, reject) => {
            authApi.deleteTicket().then(
                () => {
                    promise.emit('logout');
                    this.invalidateSession();
                    resolve('logout');
                },
                (error) => {
                    if (error.status === 401) {
                        promise.emit('unauthorized');
                    }
                    promise.emit('error');
                    reject(error);
                });
        });

        Emitter(promise); // jshint ignore:line
        return promise;
    }

    /**
     * Set the current Ticket
     *
     * @param {String} Ticket
     * */
    setTicket(ticket) {
        this.authentications.basicAuth.username = 'ROLE_TICKET';
        this.authentications.basicAuth.password = ticket;
        this.storage.setItem(this.ticketStorageLabel, ticket);
        this.ticket = ticket;
    }

    /**
     * Get the current Ticket
     *
     * @returns {String} Ticket
     * */
    getTicket() {
        return this.ticket;
    }

    invalidateSession() {
        this.storage.removeItem(this.ticketStorageLabel);
        this.authentications.basicAuth.username = null;
        this.authentications.basicAuth.password = null;
        this.ticket = null;
    }

    /**
     * If the client is logged in retun true
     *
     * @returns {Boolean} is logged in
     */
    isLoggedIn() {
        return !!this.ticket;
    }

    /**
     * return the Authentication
     *
     * @returns {Object} authentications
     * */
    getAuthentication() {
        return this.authentications;
    }

}

Emitter(EcmAuth.prototype); // jshint ignore:line