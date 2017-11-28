import webpack from 'webpack';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import base from './webpack.config.babel';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import websiteJson from './config/website.json';
import pugLintConfig from './.pug-lintrc.json';

const webpackDevConfig = {
	entry: (() => {
		const entryObj = {};

		for (const key in base.entry) {
			if ({}.hasOwnProperty.call(base.entry, key)) {
				entryObj[key] = [
					`webpack-dev-server/client?http://localhost:${websiteJson.port.webpackServer}`,
					'webpack/hot/dev-server',
					'regenerator-runtime/runtime',
					base.entry[key],
				];
			}
		}

		return entryObj;
	})(),
	output: base.output,
	module: {
		rules: base.module.rules.concat([
			Object.assign(base.module.cssRule, {
				use: [
					'style-loader',
					base.module.cssRule.use.css,
					base.module.cssRule.use.postcss,
				],
			}),
			{
				enforce: 'pre',
				test: /\.js$/,
				include: /src\/js/,
				loader: 'eslint-loader',
				options: {
					configFile: '.eslintrc.json',
				},
			},
			{
				enforce: 'pre',
				test: /\.pug$/,
				include: /src\/view/,
				loader: 'pug-lint-loader',
				options: Object.assign({
					emitError: true,
				}, pugLintConfig),
			},
		]),
	},
	plugins: [
		base.plugins.webpackEnvironment,
		base.plugins.copyWebpackPlugin,
		base.plugins.providePlugin,
		base.plugins.loaderOptionsPlugin,
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new StyleLintPlugin({
			configFile: '.stylelintrc.json',
			files: ['src/css/*.css', 'src/css/**/*.css'],
		}),
		new BrowserSyncPlugin(
			// BrowserSync options
			{
				// browse to http://localhost:3000/ during development
				host: 'localhost',
				port: websiteJson.port.browserSyncServer,
				// proxy the Webpack Dev Server endpoint
				// (which should be serving on http://localhost:8080/)
				// through BrowserSync
				proxy: `http://localhost:${
					websiteJson.port.webpackServer
				}/${
					websiteJson.multiLanguage ? websiteJson.multiLanguage[0] + '/' : ''
				}`,
				files: 'src/view/**/*.pug',
			}
		),
	].concat(base.plugins.htmlWebpackPlugin),
	devtool: 'eval',
	externals: base.externals,
};

export default webpackDevConfig;
