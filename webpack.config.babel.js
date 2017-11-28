import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import cssnext from 'postcss-cssnext';
import mixins from 'postcss-mixins';
import extend from 'postcss-extend';
import cssImport from 'postcss-import';
import websiteJson from './config/website.json';
import webpackEnv from './config/webpack';
import palette from './config/palette.json';
import externalLib from './config/external-lib.json';

const webpackBaseConfig = {
	entry: (() => {
		const entryObj = {};

		for (const key in websiteJson.pages) {
			if ({}.hasOwnProperty.call(websiteJson.pages, key)) {
				entryObj[key] = path.join(__dirname, 'src', 'js', websiteJson.pages[key].entry);
			}
		}

		return entryObj;
	})(),
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].[hash:13].js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: /src\/js/,
				use: 'babel-loader',
			},
			{
				test: /\.keep\.(jpg|png|gif)$/,
				include: [
					/src\/images/,
					/src\/library/,
				],
				loader: 'file-loader',
				options: {
					name: `${process.env.NODE_ENV === 'production' ? '' : '[name].'}[hash:13].[ext]`,
				},
			},
			{
				test: /\.(jpg|png|gif)$/,
				include: [
					/src\/images/,
					/src\/library/,
				],
				exclude: /\.keep\.(jpg|png|gif)$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: `${process.env.NODE_ENV === 'production' ? '' : '[name].'}[hash:13].[ext]`,
				}
			},
			{
				test: /\.svg$/,
				include: /src\/images/,
				use: [
					{
						loader: 'file-loader',
					},
					{
						loader: 'svgo-loader',
						options: {
							plugins: [
								{ removeTitle: true },
								{ collapseGroups: false },
							],
						},
					},
				],
			},
			{
				test: /\.pug$/,
				include: /src\/view/,
				use: 'pug-loader',
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				loader: 'file-loader',
				options: {
					name: `${process.env.NODE_ENV === 'production' ? '' : '[name].'}[hash:7].[ext]`,
				},
			},
		],
		cssRule: {
			test: /\.css$/,
			include: [
				/src\/css/,
				/node_modules\/font-awesome/,
			],
			use: {
				css: 'css-loader',
				postcss: 'postcss-loader',
			},
		},
	},
	plugins: {

		// webpack environment variables
		webpackEnvironment: new webpack.DefinePlugin({
			'process.env': webpackEnv,
		}),

		htmlWebpackPlugin: (() => {
			const htmlArr = [];

			/**
			 * return a html object
			 */
			const htmlWebpackObj = (page, language) => (
				new HtmlWebpackPlugin({
					template: `src/view/${page}.pug`,
					inject: 'body',
					filename: `${
						process.env.NODE_ENV !== 'dev' && websiteJson.multiLanguage ? '../' : ''
					}${
						language ? `${language}/${page}` : page
					}.html`,
					favicon: 'src/images/favico.png',
					minify: {
						collapseBooleanAttributes: true,
						collapseWhitespace: true,
						minifyCSS: true,
						minifyJS: true,
						quoteCharacter: '\'',
						removeComments: true,
						removeEmptyAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true,
					},
					chunks: ['manifest', 'vendor', page],
					GA: process.env.NODE_ENV === 'production' && websiteJson.GA,
					globalWording: require('./src/view/pug.json'),
					/**
					 * multiple languages system
					 */
					currentLanguage: language,
					common: language && require(
						`./src/lang/${language}/common.json`
					),
					wording: language && websiteJson.pages[page].wordingFile && require(
						`./src/lang/${language}/${websiteJson.pages[page].wordingFile}`
					),
					inlineSource: 'manifest.js$',
				})
			);

			/**
			 * generate .html file of each page
			 */
			Object.keys(websiteJson.pages).forEach((page) => {
				if (websiteJson.multiLanguage) {
					websiteJson.multiLanguage.forEach((language) => {
						htmlArr.push(htmlWebpackObj(page, language));
					});

					return;
				}

				htmlArr.push(htmlWebpackObj(page));
			});

			/**
			 * the below script is for demo & production
			 */
			if (process.env.NODE_ENV === 'dev') {
				return htmlArr;
			}

			/**
			 * add .html files at root folder
			 */
			if (websiteJson.multiLanguage && websiteJson.visitRootFolder) {
				Object.keys(websiteJson.pages).forEach((page) => {
					const rootHtmlObject = htmlWebpackObj(page, websiteJson.multiLanguage[0]);

					Object.assign(
						rootHtmlObject,
						Object.assign(rootHtmlObject.options, {
							filename: `../${page}.html`,
						})
					);

					htmlArr.push(rootHtmlObject);
				});
			}

			return htmlArr;
		})(),

		copyWebpackPlugin: new CopyWebpackPlugin([
			{
				from: 'src/static',
				to: 'static',
			},
		]),

		providePlugin: new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'root.jQuery': 'jquery',
		}),

		loaderOptionsPlugin: new webpack.LoaderOptionsPlugin({
			options: {
				postcss: [
					mixins({
						mixinsFiles: path.join(__dirname, 'src', 'css', 'mixins.css'),
					}),
					extend(),
					cssImport(),
					cssnext({
						features: {
							customProperties: {
								variables: palette,
							},
						},
					}),
				],
			}
		}),

	},
	externals: externalLib,
};

export default webpackBaseConfig;
