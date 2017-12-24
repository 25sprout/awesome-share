import { youtubeConfig } from './appConfig';
import handleErrorRequest from './handleErrorRequest';

export const youtubeParser = (urlStr) => {
	const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	const match = urlStr.match(regExp);
	if (match && match[7].length === 11) {
		return match[7];
	}

	return '';
};

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
			image: snippet.thumbnails.maxres.url,
		}))
);

export default getVideoSnippet;
