<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, Bytes } from 'firebase/firestore'
import { firebaseApp } from '@/firebaseConfig'
import { computed, reactive, inject, onBeforeMount, toValue, watch, onMounted } from 'vue';
import { delete_item, update_item_part, create_part, get_item_ref, update_item } from '@/stores/singleitem'
import { registra_volume_parte } from '@/stores/volumes'
import { useDocument } from 'vuefire';
import Modal from '@/components/Modal.vue';
import { apaga_volume } from '@/stores/volumes'; 
import { itemModel } from '@/stores/singleitem'; 
import moment from 'moment'

const {globaluser, updateUser} = inject("globaluser")   

const db = getFirestore(firebaseApp)
const route = useRoute()
const {
    // rename the Ref to something more meaningful
    data: item_db,
    // is the subscription still pending?
    pending,
    // did the subscription fail?
    error,
    // A promise that resolves or rejects when the initial state is loaded
    promise
} = useDocument(doc(db, 'items', route.params.codigo),  { maxRefDepth: 1 })




const n_partes = ref(1)
function max_terminacoes(){
    const terminacoes = item_db.value.meta.partes.map(
            parte => {
                if(typeof parte.key == 'string')
                    return parseInt(parte.key.split('-')[1])
            }
        )
    console.log(terminacoes)
    n_partes.value = Math.max(...terminacoes) + 1
}

const nova_parte = reactive(itemModel)

promise.value.then(() => {
    max_terminacoes();
    new_nova_parte(); 
})


/**
 * Callback para o botão salvar parte
 *  - Cria uma parte e pega a ref
 *  - Cria um volume e adiciona essa ref
 *  - Adiciona a ref ao item a que se refere
 */
async function adiciona_parte() {
    // Se não tinha nenhuma parte, agora vai ter e não vai ser mais inteiro
    update_item(item_db.value.key, {'meta.inteiro': false}) 
    const partRef = await create_part({...toValue(nova_parte)})
    console.log(`Cridada parte ${nova_parte.key} para item ${item_db.value.key}`) 
    await update_item_part(item_db.value.key, 'add', partRef)
    console.log(`Parte ${nova_parte.key} adicionada ao item ${item_db.value.key}`) 
    n_partes.value = n_partes.value + 1
    new_nova_parte()
    console.log(`Zerada a nova_parte: ${nova_parte.key}`)
    return true
}

async function deleta_parte(index){
    const n = item_db.value.meta.partes.length
    const parteDoc = item_db.value.meta.partes[index]
    console.log(parteDoc.key)
    const parteRef = get_item_ref(parteDoc.key)
    //const volumeKey = parteDoc.volume
    console.log(item_db.value.key,)
    await update_item_part(item_db.value.key, 'remove', parteRef)
    //await apaga_volume(volumeKey)
    if(n == 1) {
        update_item(item_db.value.key, {'meta.inteiro': true})
    }
    await delete_item(parteDoc.key)
     
}

function new_nova_parte(){
    // Reseta a nova parte para etc 
    const item_valores = {...toValue(item_db)}
    Object.assign(nova_parte, {
        responsavel: globaluser.value.displayName,
        ambiente: item_valores.ambiente.ambiente_codigo, 
        edificio: item_valores.edificio,
        detalhes: {...item_valores.detalhes, 
            descricao: null
        },
        meta: {...item_valores.meta, updated: new Date(), partes: []},
        key: item_valores.key + '-' + n_partes.value,
        tipo: "Parte"
    }  )
}

watch( () => nova_parte.short_descricao, (short_descricao) => {
    nova_parte.detalhes.descricao = item_db.value.short_descricao + ": " + nova_parte.short_descricao
 } )


</script>

<template> 
    <Modal id="addparte" :salve_callback="adiciona_parte">
        <template #titulo>
            <h4>Adicionar parte</h4>
        </template>
        <template #corpo>

            <form> 
                <div class="mb-2">
                    <label for="nome" class="form-label">Descrição da parte</label>
                    <input type="text" class="form-control" id="nome" v-model="nova_parte.short_descricao">
                </div>
                <div class="mb-2">
                    <label for="medidas" class="form-label">Medidas</label>
                    <input type="text" class="form-control" id="medidas" v-model="nova_parte.detalhes.medidas">
                </div>
                <div class="mb-2">
                    <label for="peso" class="form-label">Peso</label>
                    <input type="text" class="form-control" id="peso" v-model="nova_parte.detalhes.peso">
                </div> 
            </form>
        </template>
    </Modal>
    <div class="row align-items-start">
        <div class="col-12" v-if="item_db">
            <h4 class="d-print-none d-flex align-items-center">
                {{ item_db.short_descricao }}
                <span class="mx-3 badge text-secondary">{{ item_db.key }}</span>
            </h4>
            <p class="text-secondary p-2">
                {{ item_db.detalhes.descricao }}
            </p>
            <button class="btn btn-success" data-bs-target="#addparte" data-bs-toggle="modal">Adicionar parte</button>
            <table v-if="!pending" class="table d-print-none">
                <thead>
                    <tr>
                        <th>Nome da parte</th>
                        <th>Volume</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(parte, index) in item_db.meta.partes" :key="'parte' + index">
                        <td>
                            {{ parte.detalhes.descricao }}
                        </td>
                        <td>
                            {{ parte.meta.volume }}
                        </td>
                        <td>
                            <button class="btn btn-danger" @click="() => deleta_parte(index)">Remover</button>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </div>
    </div>
</template>
