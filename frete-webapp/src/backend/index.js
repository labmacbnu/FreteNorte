import {firebaseApp} from '../firebaseConfig';
import {getFirestore, collection, getDoc, doc } from 'firebase/firestore';

export const db = getFirestore(firebaseApp);

export const volumesRef = collection(db, "volumes") 

export async function getdoc(collRef, docRef) {
    console.log(`${collRef}/${docRef}`)
    const docSnap = await getDoc(doc(db, collRef, docRef))
    if (docSnap.exists()) { 
        return docSnap.data()
    } else {
        return null
    }
}