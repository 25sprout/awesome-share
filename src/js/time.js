const getTimestamp = () => {
	let d = new Date();
	d.setHours(d.getHours() + 8);
	d = d.toISOString();

	return `${d.slice(0, 10)}${d.slice(11, 19)}`
		.replace(/-/g, '')
		.replace(/:/g, '');
};

export default getTimestamp;
