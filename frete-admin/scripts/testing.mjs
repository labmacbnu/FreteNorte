import { getFirestore, doc, collection, setDoc, connectFirestoreEmulator } from 'firebase/firestore'
import { firebaseApp } from './firebaseConfig.mjs'
const db = getFirestore()
connectFirestoreEmulator(db, 'localhost', 8080)

import fs  from 'fs'
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const VolumesLEMA = loadJSON('./volumes-lema.json'); 

Object.entries(VolumesLEMA).forEach(([key, value]) => {
    value['items'] = value['items'].map( item => {
        doc(db, item)
    })
    console.log(key, value)
})
/*
Object.entries(VolumesLEMA).forEach(async ([key, value]) => {
    const docRef = doc(db, 'volumes', key)
    await setDoc(docRef, value)
})*/