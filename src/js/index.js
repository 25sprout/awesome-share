import $ from 'jquery';
import vex from 'vex-js/dist/js/vex.combined';

import 'font-awesome/css/font-awesome.css';
import 'vex-js/dist/css/vex.css';
import 'vex-js/dist/css/vex-theme-wireframe.css';

import { uploadHtml, uploadImage, saveMetaData, deleteMetaData } from './firebase';
import createMetaHtml from './meta';
import getTimestamp from './time';
import { getLinkLists } from './recentList';
import authAction from './login';
import getVideoSnippet, { youtubeParser } from './youtube';

import '../css/index/index.css';

vex.defaultOptions.className = 'vex-theme-wireframe';

const listAction = () => {
	$('body').on('click', '.meta-object .delete', function () {
		vex.dialog.confirm({
			message: '確定要刪除嗎？',
			callback: (value) => {
				if (!value) {
					return;
				}

				deleteMetaData(
					$(this)
						.parents('.meta-object')
						.attr('data-key'),
				);
			},
		});
	});
};

const formAction = () => {
	$('#upload-html').on('click', () => {
		if ($('#upload-html').hasClass('loading')) {
			return;
		}

		const metaData = {
			title: $(`[name='meta-title']`).val(),
			description: $(`[name='meta-description']`).val(),
			image: $(`[name='meta-image']`).val(),
			url: $(`[name='meta-url']`).val(),
		};

		if (!metaData.title) {
			return;
		}

		if (!metaData.description) {
			return;
		}

		if (!metaData.image) {
			return;
		}

		/**
		 * set loading status
		 */
		$('#upload-html').addClass('loading');

		/**
		 * upload html
		 */
		uploadHtml(createMetaHtml(metaData)).then((snapshot) => {
			/**
			 * get file url
			 */
			$('#upload-html').removeClass('loading');

			if (!snapshot.downloadURL) {
				$('.share-link a').attr('href', '');
				$('.share-link').removeClass('_show');

				return;
			}

			$('.share-link a').attr('href', snapshot.downloadURL);
			$('.share-link a').text(snapshot.downloadURL);
			$('.share-link').addClass('_show');

			/**
			 * save to database
			 */

			metaData.file = snapshot.downloadURL;
			metaData.update = getTimestamp() * -1;

			saveMetaData(metaData).then((response) => {
				console.log(`save to databse with key ${response.key}`);
			});
		});
	});

	$('.image-upload-group > i').on('click', () => {
		$('.image-upload').trigger('click');
	});

	$('.image-upload').on('change', () => {
		$('.preview .cover').addClass('loading');

		const file = document.querySelector('input[type=file]').files[0];

		if (file) {
			$('.image-upload-group i')
				.removeClass('fa-cloud-upload')
				.addClass('fa-spinner fa-spin');

			uploadImage(file).then((snapshot) => {
				/**
				 * get file url
				 */
				$(`[name='meta-image']`).val(snapshot.downloadURL).change();

				$('.image-upload-group i')
					.addClass('fa-cloud-upload')
					.removeClass('fa-spinner fa-spin');

				$('.preview .cover').removeClass('loading');
				$('.preview .card').addClass('_show');
			});
		}
	});

	$(`[name='meta-image']`).on('change', function () {
		$('.preview .cover img').attr('src', $(this).val());
	});

	$(`[name='meta-title']`).on('keyup', function () {
		if ($(this).val()) {
			$('.preview .card').addClass('_show');
		}

		$('.card .title').text($(this).val());
	});

	$(`[name='meta-description']`).on('keyup', function () {
		if ($(this).val()) {
			$('.preview .card').addClass('_show');
		}

		$('.card .description').text($(this).val());
	});

	let videoId;

	$(`[name='meta-url']`).on('keyup', function () {
		const metaUrl = $(this).val();

		if ($(`[name='meta-title']`).val() || $(`[name='meta-description']`).val()) {
			return;
		}

		if (!metaUrl || !youtubeParser(metaUrl)) {
			return;
		}

		if (videoId === youtubeParser(metaUrl)) {
			return;
		}

		videoId = youtubeParser(metaUrl);

		getVideoSnippet(videoId)
			.then(({ title, description, image }) => {
				$(`[name='meta-title']`).val(title).keyup();
				$(`[name='meta-description']`).val(description).keyup();
				$(`[name='meta-image']`).val(image).change();

				$('.preview .card').addClass('_show');
			});
	});
};

getLinkLists();
authAction();
listAction();
formAction();
