import $ from 'jquery';
import vex from 'vex-js/dist/js/vex.combined';
import * as firebase from 'firebase';
import setSnackBar from './snackbar';
import { userConfig } from './appConfig';
import { offLinkLists, getLinkLists } from './recentList';

export const isGuest = () => userConfig.uid === 'X1p273X1a7XSKuoUBATAdjZ7r7a2';

const toggleStatusButton = () => {
	$('.login-wrapper > div').removeClass('active');

	if (isGuest()) {
		$(`.login-wrapper > div[rel='guest']`).addClass('active');

		return;
	}

	$(`.login-wrapper > div[rel='login']`).addClass('active');
};

export const changeUser = (newUser) => {
	userConfig.uid = newUser;

	console.log(`changeUser to ${userConfig.uid}`);

	toggleStatusButton();
	offLinkLists();
	getLinkLists();
};

const signinUser = (email, password) => {
	firebase
		.auth()
		.signInWithEmailAndPassword(email, password).catch((error) => {
			setSnackBar(error.message);
		});
};

const signinGuest = () => {
	signinUser('awesome-share-guest@gmail.com', 'awesome-share-guest');
};

const getCurrentUser = () => {
	const { currentUser } = firebase.auth();

	if (!currentUser) {
		return false;
	}

	return currentUser.uid;
};

export const detectUserStatus = () => {
	firebase
		.auth()
		.onAuthStateChanged((user) => {
			/**
			 * user is signed in
			 */
			if (user && getCurrentUser()) {
				changeUser(getCurrentUser());
				return;
			}

			/**
			 * user is signed out
			 */
			signinGuest();
		});
};

export const openLogin = () => {
	vex.dialog.open({
		message: 'Login Awesome Share',
		input: [
			'<input name="username" type="text" placeholder="Email" required />',
			'<input name="password" type="password" placeholder="Password" required />',
		].join(''),
		buttons: [
			$.extend({}, vex.dialog.buttons.YES, { text: 'Login' }),
			$.extend({}, vex.dialog.buttons.NO, { text: 'Back' }),
		],
		callback(data) {
			if (data && data.username && data.password) {
				signinUser(data.username, data.password);
			}
		},
	});
};

const authAction = () => {
	detectUserStatus();

	$('.login-wrapper > div').on('click', function () {
		if ($(this).attr('rel') !== 'login') {
			signinGuest();

			return;
		}

		openLogin();
	});
};

export default authAction;
