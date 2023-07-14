<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { getFirestore, doc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { computed, reactive, ref } from 'vue';
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
    error: errorRef,
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
        medidas: null,
        peso: null,
        fragil: false,
        transporte_especial: false,
        inteiro: true,
        observacoes: "",
        volume: null,
        partes: []
    }
    if (item_db && item_db.value) {
        Object.assign(itemModel, {
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
        peso: valores.peso,
        fragil: valores.fragil,
        transporte_especial: valores.transporte_especial
    })

    console.log(`Item ${valores.key} atualizado ${uptime}`)
}
</script>

<template>
    <Suspense>
        <template v-if="pending">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </template>
        <template v-else>
            <template v-if="item_db">
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
                            <tbody>
                                <tr>
                                    <th scope="row">Ambiente</th>
                                    <td>{{ item.ambiente.ambiente_codigo }} - {{ item.ambiente.ambiente_nome }}</td>
                                </tr>
                                <tr v-if="item.patrimonio">
                                    <th scope="row">Patrimônio</th>
                                    <td>{{ item.patrimonio }}</td>
                                </tr>
                                <tr v-if="item.valor > 0">
                                    <th scope="row">Valor</th>
                                    <td>R$ {{ item.valor.toFixed(2) }}</td>
                                </tr>

                                <tr>
                                    <th scope="row">Medidas</th>
                                    <td><input class="form-control" v-model="item.medidas"></td>
                                </tr>

                                <tr>
                                    <th scope="row">Peso</th>
                                    <td><input class="form-control" v-model="item.peso"></td>
                                </tr>

                                <tr>
                                    <th scope="row">Extras</th>
                                    <td>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" v-model="item.fragil"
                                                id="checkfragil">
                                            <label class="form-check-label" for="checkfragil">
                                                Frágil
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox"
                                                v-model="item.transporte_especial" id="checkespecial">
                                            <label class="form-check-label" for="checkespecial">
                                                Transporte especial
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Volume</th>
                                    <td><RouterLink v-if="item.volume.codigo" class="icon-link" :to="{name: 'volume-codigo', params: {codigo: item.volume.codigo }}"><i class="bi bi-link-45deg"></i> {{ item.volume.codigo }}</RouterLink> </td>
                                </tr>
                                <tr>
                                    <th scope="row">Observações</th>
                                    <td>
                                        <textarea class="form-control"
                                            placeholder="Anote aqui casos de transporte especial, se o item precisa de calibragem, entre outros"></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Partes</th>
                                    <td>
                                        <RouterLink :to="{ name: 'item-codigo-partes', params: { codigo: item.key } }"
                                            class="">
                                            Editar partes</RouterLink>
                                    </td>

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
                    <div class="col-auto">
                        <QRCode :path="route.fullPath"></QRCode>
                    </div>
                    <div class="col">
                        <h4 class="d-none d-print-block">Sistema Frete Norte</h4>
                        <h5>{{ item.short_descricao }}</h5>
                        <p>
                            <small>
                                <b>{{ item.ambiente.ambiente_codigo }}</b> - {{ item.ambiente.ambiente_nome }}
                            </small>
                        </p>
                        <p><em>Patrimônio</em> {{ item.patrimonio }}</p>
                    </div>

                </div>
            </template>
            <div v-else class="alert alert-danger">
                <p>O item pesquisado não existe.</p>
                <RouterLink class="icon-link" :to="{ name: 'items' }"><i class="bi bi-arrow-left"></i> Voltar</RouterLink>
            </div>
        </template>
    </Suspense>
</template>
