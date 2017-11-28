import * as firebase from 'firebase';
import { firebaseConfig } from './appConfig';

firebase.initializeApp(firebaseConfig);

const firebaseDatabase = firebase.database();

export const firebaseStorage = firebase.storage();

export default firebaseDatabase;
