import { runQueryCatchError } from '../../test/helpers';

export function testLimitOffset(query: any) {
    describe('limit/offset', function () {
        test('limit too low', async () => {
            const err = await runQueryCatchError(undefined, query, { limit: -1 });
            expect(err.message.startsWith('value must be 0 or greater (was -1)')).toBeTruthy();
        });

        test('limit too high', async () => {
            const err = await runQueryCatchError(undefined, query, { limit: 101 });
            expect(err.message.startsWith('value must be 100 or less (was 101)')).toBeTruthy();
        });

        test('offset too low', async () => {
            const err = await runQueryCatchError(undefined, query, { offset: -5 });
            expect(err.message.startsWith('value must be 0 or greater (was -5)')).toBeTruthy();
        });
    });
}
