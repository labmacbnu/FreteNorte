import {firebaseApp} from '../firebaseConfig';
import {getFirestore, collection, getDoc, doc } from 'firebase/firestore';
import { useCollection, useDocument } from 'vuefire';

export const db = getFirestore(firebaseApp);

export const volumesRef = collection(db, "volumes") 

export async function getdoc(/* @type: String*/ collRef, docRef) {
    console.log(`${collRef}/${docRef}`)
    const docSnap = await getDoc(doc(db, collRef, docRef))
    if (docSnap.exists()) { 
        return docSnap.data()
    } else {
        return null
    }
}


export async function get_document(docRef) { 
    const {data: doc, promise} = useDocument(docRef)
    await promise.value
    return doc.value
}
 
export async function get_query(query) {
    const {data: docs, promise} = useCollection(query, {once: true, wait: true})
    await promise.value
    return docs.value
}