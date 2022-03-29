import * as _ from 'lodash';
import client from '../src/es';
import { getContext } from '.';
import * as constants from '../src/constants';
import createIdentityHeader from '../src/middleware/identity/utils';
import { GraphQLClient } from 'graphql-request';
import { v4 } from 'uuid';

const HOST_TEMPLATE =     {
    id: 'c9bfd617-0ec9-4122-8b01-4c7538d3e304',
    account: 'hostTagsSpecialChars',
    display_name: 'foo',
    created_on: '2019-03-10T08:07:03.354307Z',
    modified_on: '2019-03-10T08:07:03.354312Z',
    stale_timestamp: '2030-03-10T08:07:03.354307Z',
    reporter: 'puptoo',
    ansible_host: 'foo.local',
    canonical_facts: {
        fqdn: 'foo.local',
        insights_id: 'd4d30804-93a5-463c-86d4-e639443fb5c5'
    },
    system_profile_facts: {},
    per_reporter_staleness: {
        puptoo: {
            last_check_in: '2019-03-10T08:07:03.354312Z',
            stale_timestamp: '2030-03-10T08:07:03.354307Z',
            check_in_succeeded: true
        },
        yupana: {
            last_check_in: '2019-03-10T08:07:03.354312Z',
            stale_timestamp: '2030-03-10T08:07:03.354307Z',
            check_in_succeeded: true
        }
    },
    tags_structured: [{
        namespace: 'insights-client',
        key: 'os',
        value: 'fedora'
    }]
};

export async function createHost (overrides = {}) {
    const host = _.assign({}, HOST_TEMPLATE, {
        id: v4(),
        account: getContext().account
    }, overrides);

    await client.index({
        index: 'test.hosts.sink',
        type: '_doc',
        id: host.id,
        body: host,
        refresh: true
    }, {});
}

export function createHosts (...hosts: any[]) {
    return Promise.all(hosts.map(createHost));
}

export async function runQuery(
    query: string,
    variables: Record<string, any>,
    headers: any = { [constants.IDENTITY_HEADER]: createIdentityHeader()}) {

    const client = new GraphQLClient('http://localhost:4000/graphql', { headers });
    return client.rawRequest(query, variables);
}

export async function runQueryCatchError(headers: any, query = '{ hosts { data { id }}}', variables = {}) {
    try {
        await runQuery(query, variables, headers);
    } catch (e) {
        return e;
    }

    return;
}

export function createHeaders (username: string, account: string, is_internal = true) {
    return {
        [constants.IDENTITY_HEADER]: createIdentityHeader(f => f, username, account, is_internal)
    };
}
