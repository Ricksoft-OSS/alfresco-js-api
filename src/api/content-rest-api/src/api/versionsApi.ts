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

import { VersionsApi as NewVersionsApi } from '../../../../api-new/content-rest-api/api/versions.api';
import { AlfrescoApi } from '../../../../alfrescoApi';

/**
 * Constructs a new VersionsApi.
 * @alias module:api/VersionsApi
 * @class
 * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
 * default to {@link module:ApiClient#instance} if unspecified.
 */
export class VersionsApi extends NewVersionsApi {

    public init(alfrescoApi?: AlfrescoApi) {
        this.apiClient = alfrescoApi.ecmClient;
    }
}
