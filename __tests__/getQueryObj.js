import getQueryObj from '../src/js/getQueryObj';

test('without query', () => {
	expect(Object.keys(getQueryObj()).length).toBe(0);
});

test('search category and current page', () => {
	Object.defineProperty(window.location, 'search', {
		writable: true,
		value: '?category=shoes&page=7',
	});

	const queryObj = getQueryObj();

	expect(queryObj.category).toBe('shoes');
	expect(queryObj.page).toBe('7');
});
