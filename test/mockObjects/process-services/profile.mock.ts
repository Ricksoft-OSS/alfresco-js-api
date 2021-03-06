import nock from 'nock';
import { BaseMock } from '../base.mock';

export class ProfileMock extends BaseMock {
    constructor(host?: string) {
        super(host);
    }

    get200getProfile(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/profile')
            .reply(200, {
                id: 1,
                firstName: null,
                lastName: 'Administrator',
                email: 'admin',
                externalId: null,
                company: null,
                pictureId: null,
                fullname: ' Administrator',
                password: null,
                type: 'enterprise',
                status: 'active',
                created: '2016-10-21T13:32:54.886+0000',
                lastUpdate: '2016-10-23T22:16:48.252+0000',
                tenantId: 1,
                latestSyncTimeStamp: null,
                groups: [
                    {
                        id: 1,
                        name: 'analytics-users',
                        externalId: null,
                        status: 'active',
                        tenantId: 1,
                        type: 0,
                        parentGroupId: null,
                        lastSyncTimeStamp: null,
                        userCount: null,
                        users: null,
                        capabilities: null,
                        groups: null,
                        manager: null,
                    },
                    {
                        id: 2,
                        name: 'kickstart-users',
                        externalId: null,
                        status: 'active',
                        tenantId: 1,
                        type: 0,
                        parentGroupId: null,
                        lastSyncTimeStamp: null,
                        userCount: null,
                        users: null,
                        capabilities: null,
                        groups: null,
                        manager: null,
                    },
                    {
                        id: 3,
                        name: 'Superusers',
                        externalId: null,
                        status: 'active',
                        tenantId: 1,
                        type: 0,
                        parentGroupId: null,
                        lastSyncTimeStamp: null,
                        userCount: null,
                        users: null,
                        capabilities: null,
                        groups: null,
                        manager: null,
                    },
                ],
                capabilities: null,
                apps: [],
                primaryGroup: null,
                tenantPictureId: null,
                tenantName: 'test',
            });
    }

    get401getProfile(): void {
        nock(this.host, { encodedQueryParams: true }).get('/activiti-app/api/enterprise/profile').reply(401);
    }

    get200getProfilePicture(): void {
        nock(this.host, { encodedQueryParams: true }).get('/activiti-app/api/enterprise/profile-picture').reply(200, 'BUFFERSIZE');
    }
}
