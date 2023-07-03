<script setup>
import { useRoute } from 'vue-router';
import { getFirestore, doc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { computed, reactive } from 'vue';
import { update_item } from '../stores/singleitem'
import QRCode from '../components/QRCode.vue';
import { useDocument } from 'vuefire';

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
        Object.assign(itemModel,{
            ...item_db.value,
            key: item_db.value.id
        }) 
    }
    return itemModel
})

function adiciona_parte() {
    item.value.partes.push({nome: '', volume: ''})
}

async function atualiza_item() {
    const valores = { ...item.value } 
    console.log(valores.partes)

    console.log(`Item ${valores.key} atualizado ${uptime}`)
}
</script>

<template>
    <div class="row align-items-start">
        <div class="col-12">
            <h4 class="d-print-none d-flex align-items-center">
                 {{ item.short_descricao }}
                <span class="mx-3 badge text-secondary">{{ item.key }}</span>    
            </h4>
            <p class="text-secondary p-2">
                {{ item.descricao }}
            </p>
            <table class="table d-print-none">
                <thead>
                    <tr>
                        <th scope="row">Partes</th> 
                        <th>Nome da parte</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-for="(parte, index) in item.partes" :key="'parte'+index">
                        <td>
                            <button class="btn btn-danger" @click="() => item.partes.splice(index, 1)">Remover</button>
                        </td>
                        <td>
                            <input class="form-control" v-model="parte.nome">
                        </td>
                        <td>
                            <input class="form-control" v-model="parte.volume">
                        </td>
                    </tr>
                    <tr>
                        <td><button @click="adiciona_parte" class="btn btn-success">Adicionar parte</button></td>
                        <td colspan="2"></td>
                    </tr>

                    <tr class="border-primary">
                        <td colspan="3" class="text-end d-print-none">
                            <button class="btn btn-primary" @click="atualiza_item">Salvar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div> 
</template>
