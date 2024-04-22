import { getFirestore, doc, collection, setDoc, connectFirestoreEmulator } from 'firebase/firestore' 
import { firebaseApp } from './firebaseConfig.mjs'
const db = getFirestore(firebaseApp)
connectFirestoreEmulator(db, 'localhost', 8080)

const bossa_ref = doc(db, 'usuarios', 'l.f.bossa@ufsc.br')
const carregamento_ref = doc(db, 'carregamentos', 'C0003')
const volumes_cods = ['V363741', 'V353341I', 'B1230028', 'V353341E']
const volumes_refs = volumes_cods.map((cod) => doc(db, 'volumes', cod))
const data_criacao = new Date()
const tipo = "Carregamento"
const n_volumes = volumes_refs.length

const data = {
    responsavel: bossa_ref,
    carregamento: carregamento_ref,
    volumes: volumes_refs,
    data_criacao,
    tipo,
    n_volumes,
    sala: doc(db, 'ambientes-norte', 'A102')
}

const new_id = (data_criacao.getTime()).toString(36).toUpperCase() 
const docRef = doc(db, 'lotes', new_id)
await setDoc(docRef, data)