import { youtubeConfig } from './appConfig';
import handleErrorRequest from './handleErrorRequest';

const getVideoSnippet = (videoId) => (
	fetch(`
		https://www.googleapis.com/youtube/v3/videos?
			id=${videoId}
			&key=${youtubeConfig.apiKey}
			&part=snippet
	`)
		.then((res) => handleErrorRequest(res))
		.then((res) => res.items[0].snippet)
		.then((snippet) => ({
			title: snippet.title,
			description: snippet.description,
		}))
);

export default getVideoSnippet;
