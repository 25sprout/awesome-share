/**
 * export for testing
 */
export const parseQuery = (queryString) => {
	const queryArr = queryString.split('&');

	const queryObject = {};
	for (let i = 0; i < queryArr.length; i += 1) {
		let kv = queryArr[i].split('=');
		kv = [kv.shift(), kv.join('=')];

		if (kv.length === 2) {
			const nValue = decodeURIComponent(kv[1].replace(/\+/g, " "));

			if (typeof queryObject[kv[0]] === 'string') {
				queryObject[kv[0]] = [queryObject[kv[0]], nValue];
			} else {
				queryObject[kv[0]] = nValue;
			}
		}
	}
	return queryObject;
};

/**
 * MAIN function
 */
const getQueryObj = () => {
	const queryString = window.location.search.substr(1);

	// no query
	if (queryString === '') {
		return {};
	}

	return parseQuery(queryString);
};

export default getQueryObj;
