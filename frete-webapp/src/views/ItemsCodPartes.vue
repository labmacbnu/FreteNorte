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
        valor: "",
        medidas: "",
        peso: "",
        fragil: false,
        transporte_especial: false,
        inteiro: true,
        volume: "",
        partes: []
    }
    if (item_db.value) {
        Object.assign(itemModel,{
            ...item_db.value,
            key: item_db.value.id
        }) 
    }
    return itemModel
})

async function atualiza_item() {
    const valores = { ...item.value }
    console.log(valores)
    const uptime = await update_item(valores.key, {
        medidas: valores.medidas,
        peso: valores.peso ? valores.peso : null,
        fragil: valores.fragil ? valores.fragil : null,
        transporte_especial: valores.transporte_especial ? valores.transporte_especial : null
    })

    console.log(`Item ${valores.key} atualizado ${uptime}`)
}
</script>

<template>
    <div class="row align-items-start">
        <div class="col-12">
            <h4 class="d-print-none">{{ item.short_descricao }}</h4>

            <table class="table d-print-none">
                <tbody>
                    <tr>
                        <td colspan="2" class="text-secondary">{{ item.descricao }}</td>
                    </tr>
                     

                    <tr>
                        <th scope="row">Peso</th>
                        <td><input class="form-control" v-model="item.peso"></td>
                    </tr>
 

                    <tr class="border-primary">
                        <td colspan="2" class="text-end d-print-none">
                            <button class="btn btn-primary" @click="atualiza_item">Salvar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
    <div class="row justify-content-start">
        <div class="col">
            <QRCode :path="route.fullPath"></QRCode>
            <div>
                <h4 class="d-none d-print-block">Sistema Frete Norte</h4>
                <h5>{{ item.short_descricao }}</h5>
                <p><small>
                        {{ item.ambiente }}</small></p>
                <p><em>Patrimônio</em> {{ item.patrimonio }}</p>
            </div>
        </div>

    </div></template>
