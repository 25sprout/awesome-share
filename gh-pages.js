const ghpages = require('gh-pages');

ghpages.publish('build', {
	branch: 'gh-pages',
	repo: 'git@github.com:25sprout/awesome-share.git',
	user: {
		name: 'Cathy Wu',
		email: 'a304126@gmail.com',
	},
}, (err) => {
	console.log(err);
});
