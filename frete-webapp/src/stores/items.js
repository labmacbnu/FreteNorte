import { defineStore } from 'pinia'
import { getFirestore, doc, addDoc, collection, getDoc, query, 
    where, getDocs, updateDoc, runTransaction, deleteDoc, arrayRemove } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { ref, computed, reactive, watch } from 'vue'
import { useCollection } from 'vuefire' 

const db = getFirestore(firebaseApp)

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
//export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
//    const map = new Map<K, Array<V>>();
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

export function orderedGroupBy(list, keyGetter){
        var mapa = groupBy(list, keyGetter);
        var chaves = Array.from(mapa.keys())
        chaves.sort()
        var objeto_organizado = {}
        for(var k of chaves){
            objeto_organizado[k] = mapa.get(k)
        }
        return objeto_organizado 
}

 


export const useItemsAmbienteStore = defineStore('items-ambiente', ()=>{
 const ambiente = ref(null)
 const inner_db = reactive({})  
 const excluir_partes = ref(false)
 const dados = computed( () => {
    if(ambiente.value){
        return inner_db[ambiente.value]
    }
})
    function load_data(ambientes){    
        ambientes.forEach(ambiente => { 
            if(!inner_db.hasOwnProperty(ambiente)){
                const itemsColl = collection(db, "items")
                const ambienteRef = doc(db, "ambientes", ambiente)
                const q = query(itemsColl, where('ambiente', '==',  ambienteRef)) 
                inner_db [ambiente] = useCollection(q, {wait: true}); 
            }
        }) 
    }

    const dados_agrupados = computed( () =>  { 
        if(dados.value) {
            if(excluir_partes.value){
                var dados_sem_partes = dados.value.filter( x => x.tipo != 'Parte')
            } else {
                var dados_sem_partes = dados.value
            }
            var mapa = groupBy(dados_sem_partes, x => x.short_descricao);
            var chaves = Array.from(mapa.keys())
            chaves.sort()
            var objeto_organizado = {}
            for(var k of chaves){
                objeto_organizado[k] = mapa.get(k)
            }
            return objeto_organizado
        }
    })

    return {ambiente, dados, load_data, dados_agrupados, inner_db, excluir_partes}
})

export const useDescricoesStore = defineStore("short-descricoes", {
    state: () => ({short_descricoes: null}),
    actions: {
        async load_data(){
            if(this.short_descricoes == null){
                const docRef = doc(db, "agregados", "items");
                const docSnap = await getDoc(docRef);
                const $doc = docSnap.data()
                this.$patch({... $doc})
            }
        }
    }

})

export const useItemsDescricaoStore = defineStore('items-descricao', ()=>{
    const short_descricao = ref(null)
    
    const inner_db = reactive({})
    const dados = computed( () => {
       if(short_descricao.value){
           return inner_db[short_descricao.value]
       }})
   
    async function load_data(){
       // só carrega o que não tá na inner_bd
       if (! inner_db.hasOwnProperty(short_descricao.value) ){
           const q = query(collection(db, "items"), where('short_descricao', '==', short_descricao.value))
           const querySnapshot = await getDocs(q);
           inner_db[short_descricao.value] = [];
           querySnapshot.forEach( function (doc) {  
               inner_db[short_descricao.value].push(doc.data()) 
            })
           }
       }
   
       const dados_agrupados = computed( () =>  { 
           if(dados.value) {
               var mapa = groupBy(dados.value, x => x.ambiente);
               var chaves = Array.from(mapa.keys())
               chaves.sort()
               var objeto_organizado = {}
               for(var k of chaves){
                   objeto_organizado[k] = mapa.get(k)
               }
               return objeto_organizado
           }
       })
   
       return {short_descricao, dados, load_data, dados_agrupados}
   })

export const useItemsResponsavelStore = defineStore('items-responsavel', ()=>{
    const responsavel = ref(null)
})


export async function cria_item(item){
    const itemsRef = collection(db, "items")
    const ambienteRef = doc(db, "ambientes", item.ambiente)
    item.ambiente = ambienteRef
    const newDocRef = await addDoc(itemsRef, item);
    console.log("Documento escrito", newDocRef.id);
    // set key
    updateDoc(newDocRef, {key: newDocRef.id}) 
    // increment ambiente.items
    const newN = await runTransaction(db, async (transaction) => {
        const ambiente = await transaction.get(ambienteRef)
        const itemsp1 = ambiente.data().items + 1;
        transaction.update(ambienteRef, {items: itemsp1})
        return itemsp1
    })
    return newDocRef.id
}

export async function deleta_item(item_cod){ 
    const itemRef = doc(collection(db, "items"), item_cod)  

    const dele = await runTransaction(db, async (transaction) => {
        const item = await transaction.get(itemRef)
        const itemData = item.data()
        const ambienteRef =  itemData.ambiente
        const did = itemData.key
        let volumeRef;
        if(itemData.meta.volume){
            volumeRef = itemData.meta.volume
            // remove do volume
            transaction.update(volumeRef, {items: arrayRemove(itemRef)})
        }
       

        const ambiente = await transaction.get(ambienteRef)
        const itemsm1 = ambiente.data().items - 1;
        transaction.update(ambienteRef, {items: itemsm1})
 
        transaction.delete(itemRef)
        return {items: itemsm1, id:  did}
    })
    return dele
}