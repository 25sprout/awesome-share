import $ from 'jquery';
import firebaseDatabase from './firebase';
import { userConfig } from './appConfig';
import { isGuest } from './login';

const recentList = (snapshot) => {
	$('.recent .list').addClass('loading');
	$('.recent .list .meta-object').not('.meta-object-template').remove();

	snapshot.forEach((childSnapshot) => {
		const metaObjectKey = childSnapshot.key;
		const metaObject = childSnapshot.val();

		const newMetaObject = $('.meta-object-template')
			.clone().removeClass('meta-object-template');

		if (isGuest()) {
			newMetaObject.find('.controls').remove();
		}

		newMetaObject.attr('data-key', metaObjectKey);
		newMetaObject.find('.cover').append(`<img src='${metaObject.image}' />`);
		newMetaObject.find('.title').text(metaObject.title);
		newMetaObject.find('.description').text(metaObject.description);
		newMetaObject.find('.link a').attr('href', metaObject.file);
		newMetaObject.find('.link a').text(metaObject.file);

		$('.recent .list').append(newMetaObject);
	});

	$('.recent .list').removeClass('loading');
};

export const offLinkLists = () => {
	firebaseDatabase
		.ref(userConfig.uid)
		.off('value', recentList);
};

export const getLinkLists = () => {
	$('.recent .list .meta-object').not('.meta-object-template').remove();

	firebaseDatabase
		.ref(userConfig.uid)
		.orderByChild('update')
		.on('value', recentList);
};

export default recentList;
