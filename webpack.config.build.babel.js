import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import htmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';
import base from './webpack.config.babel';
import websiteJson from './config/website.json';

const webpackBuildConfig = {
	entry: (() => {
		for (const key in base.entry) {
			if ({}.hasOwnProperty.call(base.entry, key)) {
				Object.assign(base.entry, {
					[key]: ['babel-polyfill', base.entry[key]],
				});
			}
		}
		return base.entry;
	})(),
	output: {
		path: path.join(__dirname, 'build', websiteJson.multiLanguage ? 'assets' : ''),
		filename: `${process.env.NODE_ENV === 'production' ? '' : '[name].'}[chunkhash:13].js`,
		publicPath: websiteJson.multiLanguage ?
			(websiteJson.domain.asset.value ? `//${websiteJson.domain.asset.value}/` : '/assets/')
		:
			'/awesome-share/',
	},
	module: {
		rules: base.module.rules.concat(
			Object.assign(base.module.cssRule, {
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: `${base.module.cssRule.use.css}?minimize=true!${base.module.cssRule.use.postcss}`,
				}),
			})
		),
	},
	plugins: [

		base.plugins.webpackEnvironment,

		base.plugins.copyWebpackPlugin,

		base.plugins.providePlugin,

		base.plugins.loaderOptionsPlugin,

		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: `${process.env.NODE_ENV === 'production' ? '' : 'vendor.'}[hash:13].js`,
		}),

		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			filename: 'manifest.js',
			minChunks: Infinity,
		}),

		new htmlWebpackInlineSourcePlugin(),

		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
		}),

		new CopyWebpackPlugin([
			{
				from: 'src/robots.txt',
				to: 'robots.txt',
			},
		]),

		// Extract the CSS into a seperate file
		new ExtractTextPlugin(`${process.env.NODE_ENV === 'production' ? '' : '[name].'}[contenthash:13].css`),

	].concat(base.plugins.htmlWebpackPlugin),
	devtool: process.env.NODE_ENV === 'demo' ? 'source-map' : false,
	externals: base.externals,
};

export default webpackBuildConfig;
