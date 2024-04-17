import { getFirestore, doc, collection, setDoc, connectFirestoreEmulator } from 'firebase/firestore'
import { firebaseApp } from './firebaseConfig.mjs'
const db = getFirestore()
connectFirestoreEmulator(db, 'localhost', 8080)

import fs  from 'fs'
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const VolumesLEMA = loadJSON('./volumes-lema.json'); 

function splitReference(reference) {
    const [collection, id] = reference.split('/')

    return [ collection, id ]
}

function convertDictPropertyToReference(dict, property) {
    const [collection, id] = splitReference(dict[property])
    dict[property] = doc(db, collection, id)
}



Object.entries(VolumesLEMA.items).forEach(async ([key, value]) => {
    const docRef = doc(db, 'items', key)
    const valor = value 
    const referencias = ['ambiente'] 
    referencias.forEach((ref) => {
        convertDictPropertyToReference(valor, ref)
    })
    await setDoc(docRef, valor)
})

Object.entries(VolumesLEMA.usuarios).forEach(async ([key, value]) => {
    const docRef = doc(db, 'usuarios', key) 
    await setDoc(docRef, value)
})
Object.entries(VolumesLEMA['ambientes-norte']).forEach(async ([key, value]) => {
    const docRef = doc(db, 'ambientes-norte', key) 
    await setDoc(docRef, value)
})

Object.entries(VolumesLEMA.ambientes).forEach(async ([key, value]) => {
    const docRef = doc(db, 'ambientes', key)
    const valor = value 
    const referencias = ['lider'] 
    referencias.forEach((ref) => {
        convertDictPropertyToReference(valor, ref)
    })
    await setDoc(docRef, valor)
})

Object.entries(VolumesLEMA.volumes).forEach(async ([key, value]) => {
    const docRef = doc(db, 'volumes', key)
    const valor = value
    valor.item = valor.items.map((item) => {
        const [collection, id] = splitReference(item)
        const docRef = doc(db, collection, id)
        return docRef
    }) 
    const referencias = ['responsavel', 'localizacao_atual', 'origem', 'destino'] 
    referencias.forEach((ref) => {
        convertDictPropertyToReference(valor, ref)
    })
    await setDoc(docRef, valor)
})

console.log(VolumesLEMA.volumes)

/*
Object.entries(VolumesLEMA).forEach(async ([key, value]) => {
    const docRef = doc(db, 'volumes', key)
    await setDoc(docRef, value)
})*/