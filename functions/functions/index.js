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

exports.registrausuario = functions.auth.user().onCreate( async (user, context) => {
    const email = user.email;
    const nome = user.displayName;
    const docRef = db.doc(`usuarios/${email}`)
    const docData = await docRef.get()
    if(!docData.exists){
        logger.log(`Usuário criado: ${email}`)
        docRef.set({role: "Usuário", ambientes: [], usuario_de: [], nome: nome})
    } else {
        logger.log(`Usuário já existe: ${email}`)
    }

})

exports.contavolumes = functions.firestore.document("volumes/{volumeId}").onWrite( async (change, context) => {
    // Atualiza agregados/volumes.quantidade
    const collectionRef = db.collection("volumes");
    const snapshot = await collectionRef.count().get();
    const total = snapshot.data().count;
    db.doc("agregados/volumes").set({quantidade: total})
    functions.logger.log(`Total de volumes: ${total}`)

    const volumeId = context.params.volumeId 
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const document = change.after.exists ? change.after.data() : null; 
    
    // Get an object with the previous document value (for update or delete)
    const oldDocument = change.before.data();
    if(document){
             // soft delete
        if(document.deleted){

            functions.logger.log(`Soft deleted volume ${volumeId}`)
            oldDocument.items.forEach( (docRef) => docRef.update({'meta.volumado': false, 'meta.volume': null}))
        } else {
            // created or updated
            functions.logger.log(`Created of updated volume ${volumeId}`)
            const n = document.items.length
            if( n == 0) {
                collectionRef.doc(volumeId).update({'deleted': true})
                functions.logger.log(`Auto soft deleted ${volumeId}`)
            } else {
                document.items.forEach( (docRef) => docRef.update({'meta.volumado': true, 'meta.volume': db.doc(`volumes/${volumeId}`)}))
            }
            
        }
    } else {
        // hard deleted

        functions.logger.log(`Hard deleted volume ${volumeId}`)
        oldDocument.items.forEach( (docRef) => docRef.update({'meta.volumado': false, 'meta.volume': null}))
    }

})

/**
 * Get a value based on a dot-notation key.
 *
 * @param {{}} obj - Object to be read from
 * @param {string | [string]} keys - Initially, the dot-notation key.
 * @returns {*} - Value sought OR undefined if key does not exist in obj
 */
function getValue(obj, keys)
{
    keys = (typeof keys === "string") ? keys.split(".") : keys;
    const key = keys.shift();
    if (obj.hasOwnProperty(key) && keys.length === 0)
        return obj[key];
    else if (!obj.hasOwnProperty(key))
        return undefined;
    else
        return getValue(obj[key], keys);
}

/**
 * Set a value based on a dot-notation key.
 *
 * @param obj
 * @param keys
 * @param value
 */
function setValue(obj, keys, value)
{
    keys = (typeof keys === "string") ? keys.split(".") : keys;
    const key = keys.shift();

    if (keys.length === 0)
    {
        obj[key] = value;
        return;
    }
    else if (!obj.hasOwnProperty(key))
    {
        obj[key] = {};
    }

    setValue(obj[key], keys, value)
}


function parse_dbref(db_object) {
    return db_object._path.segments.join("/")
}
const export_item_getters = [
    ['key', 'controle', x =>  x  ],
    ['ambiente', 'ambiente', x =>  parse_dbref(x)],
    ['origem', 'origem', x =>  x],
    ['short_descricao', 'short_descricao', x =>  x],
    ['meta.volume', 'volume', x =>  parse_dbref(x)],
    ['key', 'controle', x =>  x  ]
]
 
function parse_doc_data(docdata) { 
    const resposta = {}
    export_item_getters.forEach( ([key, nkey, getter]) => { 
        setValue(resposta, nkey,  getter(getValue(docdata, key))) 
    })

    return resposta
}

exports.exportaVolumes = functions.https.onRequest(async (request, response) => {
    // Query the 50 latest stories
    const allVolumes = {}
    const pesquisa = db.collection('items')
      .where('meta.volumado', '==', true) 
      .get()
    await pesquisa.then( (querySnapshot) => {
        querySnapshot.forEach((doc) => { 
            allVolumes[doc.id] = parse_doc_data(doc.data())
        })
    })
    
    
    //response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.set('Content-Type', 'text/plain; charset=utf-8');
        response.write(export_item_getters.map( ([key, nkey, getter]) => nkey ).join(";") + "\n")
        Object.values(allVolumes).forEach( (volume) => {
            response.write( Object.values(volume).join(";") + "\n")
        })
    response.end("\n")
    //response.end(bundleBuffer);
  });
        
// emulator http://127.0.0.1:5001/frete-norte-ufsc-blumenau/us-central1/exportaVolumes

exports.processaLotes = functions.firestore.document("lotes/{loteId}").onCreate(async (change, context) => {
    const loteId = context.params.loteId
    const lote = change.data() 
    const volumes = lote.volumes 
    const tipo = lote.tipo 
    if(tipo == "Descarregamento"){
        const sala_ref = lote.sala
        logger.log(`Lote modificado: ${loteId}. Descarregado em ${sala_ref._path.segments.join("/")}`)
        const volumes_ids = volumes.map( (volume) => volume.id)
        const promessas = volumes.map( async (volume) => {
            volume.update({'localizacao_atual': sala_ref})
            const volume_id = volume.id
            const movimento_ref = db.doc(`movimentos/${volume_id}`)
            const movimento_data = { 
                descarregado: { 
                    data_hora: lote.data_criado,
                    resposavel: lote.responsavel,
                    sala: sala_ref,
                    carregamento: lote.carregamento
                }
            } 
            movimento_ref.set(movimento_data, { merge: true })
        })
        Promise.all(promessas).then(logger.log(`Volumes atualizados: ${volumes_ids}`))
    } else if (tipo == "Carregamento"){ 
        const carregamento = lote.carregamento
        logger.log(`Lote modificado: ${loteId}. Carregado em ${carregamento._path.segments.join("/")}`)
        const volumes_ids = volumes.map( (volume) => volume.id)
        const promessas = volumes.map( async (volume) => { 
            const volume_id = volume.id
            const movimento_ref = db.doc(`movimentos/${volume_id}`)
            const movimento_data = { 
                carregado: { 
                    data_hora: lote.data_criado, 
                    resposavel: lote.responsavel,
                    carregamento: lote.carregamento
                }
            } 

            movimento_ref.set(movimento_data, { merge: true })
    })
    Promise.all(promessas).then(logger.log(`Volumes atualizados: ${volumes_ids}`))
}
})
