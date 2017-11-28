import { domain } from '../src/js/appConfig';

test('this should be the domain of the demo server', () => {
	expect(domain).toBe('demoDomain.com');
});
