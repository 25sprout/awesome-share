import { parseQuery } from '../src/js/getQueryObj';

test('search user ID', () => {
	expect(parseQuery('id=1337').id).toBe('1337');
});

describe('user login', () => {
	const obj = parseQuery('token=wS/0wmVV9x/3gmMCoc=&user=Milu');

	it('url contains token', () => {
		expect(obj.token).toBe('wS/0wmVV9x/3gmMCoc=');
	});

	it('user is Milu', () => {
		expect(obj.user).toBe('Milu');
	});
});
