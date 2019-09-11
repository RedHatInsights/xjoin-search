import { getQuery } from '../../../test';

describe('hosts query', function () {
    test('fetch hosts', async () => {
        const data = await getQuery()({
            query: `
                { hosts(
                    filter:
                        {system_profile_fact:
                            {key: "os_release" value: "7.4"}
                        }
                    )
                    {
                        data {
                            id, account, display_name
                        }
                    }
                }`
        });

        expect(data).toMatchSnapshot();
    });
});
