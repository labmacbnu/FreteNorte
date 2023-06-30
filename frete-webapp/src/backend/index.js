import {firebaseApp} from '../firebaseConfig';
import {getFirestore, collection} from 'firebase/firestore';

export const db = getFirestore(firebaseApp);

export const volumesRef = collection(db, "volumes") 