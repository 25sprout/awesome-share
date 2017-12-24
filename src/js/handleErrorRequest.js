export const handleErrorRequestInText = (response) => {
	if (response.status >= 400 && response.status < 500) {
		return response.text().then((json) => Promise.reject(json));
	}

	return response.text();
};

const handleErrorRequest = (response) => {
	if (response.status >= 400 && response.status < 500) {
		return response.json().then((json) => Promise.reject(json));
	}

	return response.json();
};

export default handleErrorRequest;
