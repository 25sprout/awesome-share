import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.config.dev.babel';
import websiteJson from './config/website.json';

new WebpackDevServer(webpack(config), {
	contentBase: config.output.path,
	publicPath: config.output.publicPath,
	hot: true,
	noInfo: true,
	overlay: true,
}).listen(websiteJson.port.webpackServer, 'localhost', (err, result) => {
	if (err) {
		console.log(result);
		return;
	}

	return;
});
