import $ from 'jquery';

import '../css/snackbar.css';

const setSnackBar = (msg) => {
	$('.snackbar .msg').text(msg);
	$('.snackbar').addClass('active');

	setTimeout(() => {
		$('.snackbar').addClass('fade');
	}, 30);

	setTimeout(() => {
		$('.snackbar').removeClass('fade');

		setTimeout(() => {
			$('.snackbar').removeClass('active');
		}, 1500);
	}, 1500);
};

export default setSnackBar;
