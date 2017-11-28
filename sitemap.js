#! /usr/bin/env node

const fs = require('fs');
const json = require('./config/website.json');

// generate alternate xhtml tag
const alternateLink = (path, lang) => `\t\t<xhtml:link rel='alternate' hreflang='${lang}' href='${
	json.domain.production.ssl ? 'https' : 'http'
}://${
	json.domain.production.value
}/${
	path
}.html' />\n`;

const generateLocTag = (page) => {
	if (json.multiLanguage) {
		return `<loc>${
			json.domain.production.ssl ? 'https' : 'http'
		}://${
			json.domain.production.value
		}/${
			json.multiLanguage[0]
		}/${
			page
		}.html</loc>\n`;
	}

	return `<loc>${
		json.domain.production.ssl ? 'https' : 'http'
	}://${
		json.domain.production.value
	}/${
		page
	}.html</loc>\n`;
};

/**
 * generate a url tag
 * it is a single page
 */
const generatePageUrlTag = (page) => {
	/**
	 * this is a start tag
	 */
	let url = '\t<url>\n\t\t';

	url += generateLocTag(page);

	if (json.multiLanguage) {
		json.multiLanguage.forEach((lang) => {
			url += alternateLink(`${lang}/${page}`, lang === 'tw' ? 'zh' : lang);
		});
	}

	/**
	 * this is an close tag
	 */
	url += '\t</url>\n';

	return url;
};

let urlGroup = '';

/**
 * append each page url node
 */
Object.keys(json.pages).forEach((page) => {
	/**
	 * ignore this page
	 */
	if (json.pages[page].sitemapIgnore) {
		return;
	}

	urlGroup += generatePageUrlTag(page);
});

/**
 * prepare files string
 */
const xmlContent = (
`<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9' xmlns:xhtml='http://www.w3.org/1999/xhtml'>
${urlGroup}</urlset>
`);

/**
 * Write `sitemap.xml` file
 */
fs.writeFile('build/sitemap.xml', xmlContent, (err) => {
	if (err) {
		console.log(err);
		return;
	}

	/**
	 * Fancy animation
	 */
	const unitStr = '#';
	const number = 25;
	const log = (string) => process.stdout.write(string);

	for (let i = 0; i < number; i += 1) {
		setTimeout(() => {
			log(`\r${unitStr.repeat(i + 1)} (${i + 1}/${number})`);

			if (i === number - 1) {
				log('\nNew sitemap is generated.\n\n');
			}
		}, i * 50);
	}

	return;
});
