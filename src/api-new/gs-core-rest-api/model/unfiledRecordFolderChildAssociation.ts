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

import { ChildAssociationInfo } from './childAssociationInfo';
import { PathInfo } from './pathInfo';
import { UnfiledRecordFolderChild } from './unfiledRecordFolderChild';
import { UserInfo } from './userInfo';

export class UnfiledRecordFolderChildAssociation {
    id: string;
    parentId: string;
    /**
     * The name must not contain spaces or the following special characters: * \" < > \\ / ? : and |.
The character . must not be used at the end of the name.

     */
    name: string;
    nodeType: string;
    isUnfiledRecordFolder: boolean;
    isRecord: boolean;
    modifiedAt: Date;
    modifiedByUser: UserInfo;
    createdAt: Date;
    createdByUser: UserInfo;
    aspectNames?: Array<string>;
    properties?: any;
    allowableOperations?: Array<string>;
    path?: PathInfo;
    association?: ChildAssociationInfo;
}
