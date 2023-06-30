/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
 
const logger = require("firebase-functions/logger");
 
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   resp 
const  functions  = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore")

initializeApp();
const db = getFirestore();

exports.registrausuario = functions.auth.user().onCreate( (user, context) => {
    const email = user.email;
    const nome = user.displayName;
    db.doc(`permissoes/${email}`).set({role: "Usuário", ambientes: [], nome: nome})
    logger.log(`Usuário criado: ${email}`)

})

exports.contavolumes = functions.firestore.document("volumes/{volumeId}").onWrite( async (change, context) => {
    const collectionRef = db.collection("volumes");
    const snapshot = await collectionRef.count().get();
    const total = snapshot.data().count;
    db.doc("agregados/volumes").set({quantidade: total})
})
