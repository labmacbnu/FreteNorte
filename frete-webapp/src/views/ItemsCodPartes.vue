<script setup>
import { useRoute } from 'vue-router';
import { getFirestore, doc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { computed, reactive, inject } from 'vue';
import { update_item_part, create_part, get_parte_ref } from '../stores/singleitem'
import { useNumVolumesStore, registra_volume_parte } from '../stores/volumes'
import { useDocument } from 'vuefire';
import Modal from '../components/Modal.vue';
import { apaga_volume } from '../stores/volumes';
const n_volumes = useNumVolumesStore()

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
} = useDocument(doc(db, 'items', route.params.codigo))

const item = computed(() => {
    const itemModel = {
        key: "",
        descricao: "",
        short_descricao: "",
        ambiente: "",
        patrimonio: "",
        valor: 0,
        medidas: "",
        peso: "",
        fragil: false,
        transporte_especial: false,
        inteiro: true,
        volume: "",
        partes: reactive([])
    }
    if (item_db.value) {
        Object.assign(itemModel, {
            ...item_db.value,
            key: item_db.value.id
        })
    }
    return itemModel
})

const nova_parte = reactive({
    key: item.value.key + '-' + (item.value.partes.length + 1),
    short_descricao: "",
    partent: item.value.key,
    ambiente: item.value.ambiente,
    patrimonio: item.value.patrimonio,
    medidas: "",
    peso: "",
    fragil: item.value.fragil,
    transporte_especial: item.value.transporte_especial,
    inteiro: false,
    volume: n_volumes.codigo
})

async function adiciona_parte() {
    const partRef = await create_part({...nova_parte, descricao: item.value.short_descricao + ": " + nova_parte.short_descricao})
    console.log(`Cridada parte ${partRef.id} para item ${item.value.key}`)
    await update_item_part(item.value.key, 'add', partRef)
    console.log(`Parte ${partRef.id} adicionada ao item ${item.value.key}`)
    const dados_volume = {
        codigo: n_volumes.codigo,
        items: [ partRef ],
        responsavel: globaluser.value.email
    } 
    await registra_volume_parte({...dados_volume} )
    console.log(`Volume ${n_volumes.codigo} criado para parte ${partRef.id}`)
    Object.assign(nova_parte, 
    {short_descricao: "", medidas: "", peso: "", fragil: false, transporte_especial: false, inteiro: false,
    key: item.value.key + '-' + (item.value.partes.length + 1)})
    console.log(`Zerada a nova_parte: ${nova_parte}`)
    return true
}

async function deleta_parte(index){
    const parteDoc = item.value.partes[index]
    const perteRef = await get_parte_ref(parteDoc.key)
    const volumeKey = parteDoc.volume
    await update_item_part(item.value.key, 'remove', perteRef)
    await apaga_volume(volumeKey)
    await deleta_parte(parteDoc.key)
     
}
</script>

<template>
    <Modal id="addparte" :salve_callback="adiciona_parte">
        <template #titulo>
            <h4>Adicionar parte</h4>
        </template>
        <template #corpo>

            <form>
                <div class="mb-2">
                    <label for="volume" class="form-label">Volume</label>
                    <input disabled type="text" class="form-control" id="volume" v-model="nova_parte.volume">
                </div>
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
        <div class="col-12">
            <h4 class="d-print-none d-flex align-items-center">
                {{ item.short_descricao }}
                <span class="mx-3 badge text-secondary">{{ item.key }}</span>
            </h4>
            <p class="text-secondary p-2">
                {{ item.descricao }}
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
                    <tr v-for="(parte, index) in item.partes" :key="'parte' + index">
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

        </div>
    </div>
</template>
