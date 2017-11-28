import $ from 'jquery';
import { uploadHtml, uploadImage } from './firebase';
import createMetaHtml from './meta';

import '../css/index/index.css';

$(document).ready(() => {
	$('#upload-html').on('click', () => {
		const metaData = {
			title: $(`[name='meta-title']`).val(),
			description: $(`[name='meta-description']`).val(),
			image: $(`[name='meta-image']`).val(),
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

		uploadHtml(createMetaHtml(metaData)).then((snapshot) => {
			/**
			 * get file url
			 */

			if (!snapshot.downloadURL) {
				$('.preview .link a').attr('href', '');
				$('.preview .link').removeClass('_show');

				return;
			}

			$('.preview .link a').attr('href', snapshot.downloadURL);
			$('.preview .link a').text(snapshot.downloadURL);
			$('.preview .link').addClass('_show');
		});
	});

	$('.image-upload').on('change', () => {
		const preview = document.querySelector('img');
		const file = document.querySelector('input[type=file]').files[0];
		const reader = new FileReader();

		reader.addEventListener('load', () => {
			preview.src = reader.result;
		}, false);

		if (file) {
			$('.preview .card').addClass('_show');

			reader.readAsDataURL(file);

			uploadImage(file).then((snapshot) => {
				/**
				 * get file url
				 */

				$(`[name='meta-image']`).val(snapshot.downloadURL);
			});
		}
	});

	$(`[name='meta-title']`).on('keydown', function () {
		if ($(this).val()) {
			$('.preview .card').addClass('_show');
		}

		$('.card .title').text($(this).val());
	});

	$(`[name='meta-description']`).on('keydown', function () {
		if ($(this).val()) {
			$('.preview .card').addClass('_show');
		}

		$('.card .description').text($(this).val());
	});
});
