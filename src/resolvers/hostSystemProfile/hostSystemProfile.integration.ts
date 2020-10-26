import { runQuery, createHosts } from '../../../test/helpers';
import { getContext } from '../../../test';
import { testLimitOffset } from '../test.common';

describe('host system profile', function () {
    describe('sap_system', function () {
        const QUERY = `
            query hostSystemProfile (
                $hostFilter: HostFilter,
                $order_by: VALUES_ORDER_BY,
                $order_how: ORDER_DIR,
                $limit: Int,
                $offset: Int) {
                hostSystemProfile (
                    hostFilter: $hostFilter
                )
                {
                    sap_system (
                        order_by: $order_by,
                        order_how: $order_how,
                        limit: $limit,
                        offset: $offset
                    ) {
                        meta {
                            count
                            total
                        }
                        data {
                            value
                            count
                        }
                    }
                }
            }
        `;

        const hosts = [
            {display_name: 'foo01', system_profile_facts: {sap_system: true}},
            {display_name: 'foo02', system_profile_facts: {sap_system: true}},
            {display_name: 'foo03', system_profile_facts: {sap_system: true}},
            {display_name: 'foo04', system_profile_facts: {sap_system: true}},
            {display_name: 'bar01', system_profile_facts: {sap_system: false}},
            {display_name: 'bar02', system_profile_facts: {sap_system: false}},
            {display_name: 'bar03', system_profile_facts: {}}
        ];

        const meta = {
            total: 2,
            count: 2
        };

        const sapSystemTrue = {
            value: true,
            count: 4
        };

        const sapSystemFalse = {
            value: false,
            count: 2
        };

        test('basic query', async () => {
            await createHosts(...hosts);

            const { data, status } = await runQuery(QUERY, {}, getContext().headers);
            expect(status).toEqual(200);
            data.hostSystemProfile.sap_system.should.eql({
                meta,
                data: [sapSystemFalse, sapSystemTrue]
            });
        });

        testLimitOffset(QUERY);

        test('pagination', async () => {
            await createHosts(...hosts);

            const { data, status } = await runQuery(QUERY, {limit: 1, offset: 1}, getContext().headers);
            expect(status).toEqual(200);
            data.hostSystemProfile.sap_system.should.eql({
                meta: {total: 2, count: 1},
                data: [sapSystemTrue]
            });
        });

        describe('ordering', function () {
            test('order value DESC', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    order_by: 'value',
                    order_how: 'DESC'
                }, getContext().headers);
                expect(status).toEqual(200);
                data.hostSystemProfile.sap_system.should.eql({
                    meta,
                    data: [sapSystemTrue, sapSystemFalse]
                });
            });

            test('order count ASC', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    order_by: 'count',
                    order_how: 'ASC'
                }, getContext().headers);
                expect(status).toEqual(200);
                data.hostSystemProfile.sap_system.should.eql({
                    meta,
                    data: [sapSystemFalse, sapSystemTrue]
                });
            });
        });

        test('host filter', async () => {
            await createHosts(...hosts);

            const { data, status } = await runQuery(QUERY, {
                hostFilter: {
                    display_name: {
                        matches: 'foo*'
                    }
                }
            }, getContext().headers);
            expect(status).toEqual(200);
            data.hostSystemProfile.sap_system.should.eql({
                meta: {total: 1, count: 1},
                data: [{ value: true, count: 4}]
            });
        });
    });

    describe('sap_sids', function () {
        const QUERY = `
            query hostSystemProfile (
                $hostFilter: HostFilter,
                $filter: SapSidFilter,
                $order_by: VALUES_ORDER_BY,
                $order_how: ORDER_DIR,
                $limit: Int,
                $offset: Int) {
                hostSystemProfile (
                    hostFilter: $hostFilter
                )
                {
                    sap_sids (
                        order_by: $order_by,
                        order_how: $order_how,
                        filter: $filter,
                        limit: $limit,
                        offset: $offset
                    ) {
                        meta {
                            count
                            total
                        }
                        data {
                            value
                            count
                        }
                    }
                }
            }
        `;

        const hosts = [
            {display_name: 'foo01', system_profile_facts: {sap_sids: []}},
            {display_name: 'foo02', system_profile_facts: {sap_sids: ['ABC']}},
            {display_name: 'foo03', system_profile_facts: {sap_sids: ['ABC', 'DEF']}},
            {display_name: 'foo04', system_profile_facts: {sap_sids: ['ABC', 'DEF', 'GHI']}},
            {display_name: 'bar01', system_profile_facts: {sap_sids: ['ABC', 'DEF', 'GHI', 'JKL']}},
            {display_name: 'bar02', system_profile_facts: {sap_sids: ['ABC', 'DEF', 'GHI', 'JKL', 'MNO']}},
            {display_name: 'bar03', system_profile_facts: {sap_sids: ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR']}},
            {display_name: 'bar04', system_profile_facts: {
                sap_sids: ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'KeyΔwithčhars*+!.,-_ ']
            }}
        ];

        const abc = { value: 'ABC', count: 7};
        const def = { value: 'DEF', count: 6};
        const ghi = { value: 'GHI', count: 5};
        const jkl = { value: 'JKL', count: 4};
        const mno = { value: 'MNO', count: 3};
        const pqr = { value: 'PQR', count: 2};
        const special = { value: 'KeyΔwithčhars*+!.,-_ ', count: 1};

        test('basic query', async () => {
            await createHosts(...hosts);

            const { data, status } = await runQuery(QUERY, {}, getContext().headers);
            expect(status).toEqual(200);
            data.hostSystemProfile.sap_sids.meta.should.eql({total: 7, count: 7});
            data.hostSystemProfile.sap_sids.data.should.eql([abc, def, ghi, jkl, special, mno, pqr]);
        });

        testLimitOffset(QUERY);

        describe('pagination', function () {
            test('limit', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    limit: 2
                }, getContext().headers);
                expect(status).toEqual(200);

                data.hostSystemProfile.sap_sids.meta.should.eql({total: 7, count: 2});
                data.hostSystemProfile.sap_sids.data.should.eql([abc, def]);
            });

            test('limit + offset', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    limit: 2,
                    offset: 2
                }, getContext().headers);
                expect(status).toEqual(200);

                data.hostSystemProfile.sap_sids.meta.should.eql({total: 7, count: 2});
                data.hostSystemProfile.sap_sids.data.should.eql([ghi, jkl]);
            });

            test('limit + offset + search', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    limit: 1,
                    offset: 1,
                    filter: {
                        search: {
                            regex: '.*K.*'
                        }
                    }
                }, getContext().headers);
                expect(status).toEqual(200);

                data.hostSystemProfile.sap_sids.meta.should.eql({total: 2, count: 1});
                data.hostSystemProfile.sap_sids.data.should.eql([special]);
            });
        });

        describe('ordering', function () {
            test('ordering value DESC', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    order_by: 'value',
                    order_how: 'DESC'
                }, getContext().headers);
                expect(status).toEqual(200);

                data.hostSystemProfile.sap_sids.meta.should.eql({total: 7, count: 7});
                data.hostSystemProfile.sap_sids.data.should.eql([pqr, mno, special, jkl, ghi, def, abc]);
            });
        });

        test('host filter', async () => {
            await createHosts(...hosts);

            const { data, status } = await runQuery(QUERY, {
                hostFilter: {
                    display_name: {
                        matches: 'foo*'
                    }
                }
            }, getContext().headers);
            expect(status).toEqual(200);

            data.hostSystemProfile.sap_sids.meta.should.eql({total: 3, count: 3});
            data.hostSystemProfile.sap_sids.data.should.eql([
                { value: 'ABC', count: 3},
                { value: 'DEF', count: 2},
                { value: 'GHI', count: 1}
            ]);
        });

        describe('sap_sid filter', function () {
            test('by sap_sid name', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    filter: {
                        search: {
                            eq: 'ABC'
                        }
                    }
                }, getContext().headers);

                expect(status).toEqual(200);
                data.hostSystemProfile.sap_sids.meta.should.eql({total: 1, count: 1});
                data.hostSystemProfile.sap_sids.data.should.eql([abc]);
            });

            test('by sap_sid name negative', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    filter: {
                        search: {
                            eq: '.*ABC.*'
                        }
                    }
                }, getContext().headers);

                expect(status).toEqual(200);
                data.hostSystemProfile.sap_sids.meta.should.eql({total: 0, count: 0});
                data.hostSystemProfile.sap_sids.data.should.be.empty();
            });

            test('by sap_sid name prefix', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    filter: {
                        search: {
                            regex: 'AB.*'
                        }
                    }
                }, getContext().headers);

                expect(status).toEqual(200);
                data.hostSystemProfile.sap_sids.meta.should.eql({total: 1, count: 1});
                data.hostSystemProfile.sap_sids.data.should.eql([abc]);
            });

            test('by sap_sid name substring', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    filter: {
                        search: {
                            regex: '.*B.*'
                        }
                    }
                }, getContext().headers);

                expect(status).toEqual(200);
                data.hostSystemProfile.sap_sids.meta.should.eql({total: 1, count: 1});
                data.hostSystemProfile.sap_sids.data.should.eql([abc]);
            });

            test('by sap_sid name suffix', async () => {
                await createHosts(...hosts);

                const { data, status } = await runQuery(QUERY, {
                    filter: {
                        search: {
                            regex: '.*C'
                        }
                    }
                }, getContext().headers);

                expect(status).toEqual(200);
                data.hostSystemProfile.sap_sids.meta.should.eql({total: 1, count: 1});
                data.hostSystemProfile.sap_sids.data.should.eql([abc]);
            });

            describe('special characters', function () {
                Array.from('Δč*+!.,_ ').forEach(i =>
                    test(`search by "${i}"`, async () => {
                        await createHosts(...hosts);

                        const { data, status } = await runQuery(QUERY, {
                            filter: {
                                search: {
                                    regex: `.*\\${i}.*`
                                }
                            }
                        }, getContext().headers);

                        expect(status).toEqual(200);
                        data.hostSystemProfile.sap_sids.meta.should.eql({total: 1, count: 1});
                        data.hostSystemProfile.sap_sids.data.should.eql([special]);
                    })
                );
            });
        });
    });
});

