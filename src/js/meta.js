const metaHtmlTemplate = `<!DOCTYPE html>
<html lang='zh-Hant'>
	<head>
		<meta charset='UTF-8'>
		<meta property='og:title' content='_{{TITLE}}_'>
		<meta property='og:description' content='_{{DESCRIPTION}}_'>
		<meta property='og:image' content='_{{IMAGE}}_'>
	</head>

	<script>
		location.href = '_{{URL}}_';
	</script>
</html>`;

const createMetaHtml = (mataData) => {
	const newMetaHtml = metaHtmlTemplate
		.replace('_{{TITLE}}_', mataData.title)
		.replace('_{{DESCRIPTION}}_', mataData.description)
		.replace('_{{IMAGE}}_', mataData.image)
		.replace('_{{URL}}_', mataData.url);

	const newBlob = new Blob([newMetaHtml], { type: 'text/html' });

	return newBlob;
};

export default createMetaHtml;
