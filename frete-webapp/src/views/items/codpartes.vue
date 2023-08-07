<script setup>
import { useRoute } from 'vue-router';
import { getFirestore, doc } from 'firebase/firestore'
import { firebaseApp } from '@/firebaseConfig'
import { computed, reactive, inject, onBeforeMount, toValue, watch } from 'vue';
import { delete_part, update_item_part, create_part, get_parte_ref, update_item } from '@/stores/singleitem'
import { useNumVolumesStore, registra_volume_parte } from '@/stores/volumes'
import { useDocument } from 'vuefire';
import Modal from '@/components/Modal.vue';
import { apaga_volume } from '@/stores/volumes'; 

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

const n_partes = computed(() => item_db.value.partes ? item_db.value.partes.length + 1: 1 )

const nova_parte = reactive({})

/**
 * Callback para o botão salvar parte
 *  - Cria uma parte e pega a ref
 *  - Cria um volume e adiciona essa ref
 *  - Adiciona a ref ao item a que se refere
 */
async function adiciona_parte() {
    // Se não tinha nenhuma parte, agora vai ter e não vai ser mais inteiro
    update_item(item_db.value.key, {inteiro: false}) 
    const partRef = await create_part(toValue(nova_parte))
    console.log(`Cridada parte ${partRef.id} para item ${item_db.key}`)
    //await update_item_part(item_db.key, 'add', partRef)
    console.log(`Parte ${partRef.id} adicionada ao item ${item_db.key}`) 
    new_nova_parte()
    console.log(`Zerada a nova_parte: ${nova_parte}`)
    return true
}

async function deleta_parte(index){
    const parteDoc = item_db.partes[index]
    const perteRef = await get_parte_ref(parteDoc.key)
    //const volumeKey = parteDoc.volume
    await update_item_part(item_db.key, 'remove', perteRef)
    //await apaga_volume(volumeKey)
    await delete_part(parteDoc.key)
     
}

function new_nova_parte(){
    // Reseta a nova parte para etc 
    Object.assign(nova_parte, {
    key: item_db.value.key + '-' + n_partes.value,
    short_descricao: "", 
    descricao: "",
    ambiente: item_db.value.ambiente.id,
    patrimonio: item_db.value.patrimonio,
    medidas: "",
    peso: "",
    fragil: item_db.value.fragil, 
    inteiro: true, 
    })
}
watch( () => nova_parte.short_descricao, (short_descricao) => {
    nova_parte.descricao = item_db.value.short_descricao + ": " + nova_parte.short_descricao
 } )

onBeforeMount(() => {
    if(pending) {
        setTimeout(new_nova_parte(), 300)
    } else {
        new_nova_parte()
    }
})

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
                    <input type="text" class="form-control" id="medidas" v-model="nova_parte.medidas">
                </div>
                <div class="mb-2">
                    <label for="peso" class="form-label">Peso</label>
                    <input type="text" class="form-control" id="peso" v-model="nova_parte.peso">
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="inlineCheckbox1" v-model="nova_parte.fragil">
                    <label class="form-check-label" for="inlineCheckbox1">Frágil</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="inlineCheckbox2" v-model="nova_parte.transporte_especial">
                    <label class="form-check-label" for="inlineCheckbox2">Transporte especial</label>
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
                {{ item_db.descricao }}
            </p>
            <button class="btn btn-success" data-bs-target="#addparte" data-bs-toggle="modal">Adicionar parte</button>
            <table class="table d-print-none">
                <thead>
                    <tr>
                        <th>Nome da parte</th>
                        <th>Volume</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(parte, index) in item_db.partes" :key="'parte' + index">
                        <td>
                            {{ parte.descricao }}
                        </td>
                        <td>
                            {{ parte.volume }}
                        </td>
                        <td>
                            <button class="btn btn-danger" @click="() => deleta_parte(index)">Remover</button>
                        </td>
                    </tr>
                </tbody>
            </table>
<p><code>{{ nova_parte }}</code></p> 
        </div>
    </div>
</template>
