const metaHtmlTemplate = `<!DOCTYPE html>
<html lang='zh-Hant'>
	<head>
		<meta charset='UTF-8'>
		<meta property='og:title' content='META title'>
		<meta property='og:description' content='META description'>
		<meta property='og:image' content='META image'>
	</head>
</html>`;

const createMetaHtml = () => {
	const newBlob = new Blob([metaHtmlTemplate], { type: 'text/html' });

	return newBlob;
};

export default createMetaHtml;
