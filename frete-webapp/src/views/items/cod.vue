<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { getFirestore, doc } from 'firebase/firestore'
import { firebaseApp } from '@/firebaseConfig'
import { computed, reactive, ref, toValue } from 'vue';
import { update_item } from '@/stores/singleitem'
import QRCode from '@/components/QRCode.vue';
import { useDocument } from 'vuefire';
import ModalDelete from '@/components/ModalDelete.vue';
import { deleta_item } from '@/stores/items'; 

const db = getFirestore(firebaseApp)
const route = useRoute()
const router = useRouter()
const {
    // rename the Ref to something more meaningful
    data: item,
    // is the subscription still pending?
    pending,
    // did the subscription fail?
    error: errorRef,
    // A promise that resolves or rejects when the initial state is loaded
    promise
} = useDocument(doc(db, 'items', route.params.codigo))

async function atualiza_item() {
    const valores = toValue(item)
    console.log({...valores.detalhes})
    const uptime = await update_item(valores.key, {
         "detalhes.medidas":   valores.detalhes.medidas,
          "detalhes.peso": valores.detalhes.peso
    })  

    console.log(`Item ${valores.key} atualizado`)
}

async function front_apaga_volume() {
    if(item.value.categoria != 'Permanente') {
        const ambiente_route =  item.value.ambiente.ambiente_codigo
        const resultado = await deleta_item(item.value.key)
        console.log(resultado)
        setTimeout( () => router.push({name: 'items-ambiente', params: { ambiente: ambiente_route}}), 250)
        return true
    } else {
        return false
    }
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
            <template v-if="item">
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
                                <tr v-if="item.detalhes.patrimonio">
                                    <th scope="row">Patrimônio</th>
                                    <td>{{ item.detalhes.patrimonio }}</td>
                                </tr>
                                <tr v-if="item.detalhes.valor > 0">
                                    <th scope="row">Valor</th>
                                    <td>R$ {{ item.detalhes.valor.toFixed(2) }}</td>
                                </tr>

                                <tr>
                                    <th scope="row">Medidas</th>
                                    <td><input class="form-control" v-model="item.detalhes.medidas"></td>
                                </tr>

                                <tr>
                                    <th scope="row">Peso</th>
                                    <td><input class="form-control" v-model="item.detalhes.peso"></td>
                                </tr>
                                <tr>
                                    <th scope="row">Volume</th>
                                    <td>
                                        <template v-if="item.meta.volume">
                                        <RouterLink class="icon-link" :to="{name: 'volume-codigo', params: {codigo: item.meta.volume.codigo }}">
                                            <i class="bi bi-link-45deg"></i> {{ item.meta.volume.codigo }}</RouterLink> 
                                        </template>
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
                                    <td colspan="2" class="text-end d-print-none justify-content-between">

                                        <button v-if="item.tipo != 'Permanente'" class="btn btn-danger mx-3" data-bs-target="#deletar" data-bs-toggle="modal" >Deletar</button>
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
                        <p><em>Patrimônio</em> {{ item.detalhes.patrimonio }}</p>
                        <p>Patrimoniado em nome de {{ item.responsavel }}</p>
                    </div>

                </div>

    <ModalDelete id="deletar"  :delete_callback="async () => await front_apaga_volume()">
        <template #titulo>
            Apagar item
        </template>
        <template #corpo>
            Certeza que quer apagar o item {{item.short_descricao}}?
        </template>
    </ModalDelete>
            </template>
            <div v-else class="alert alert-danger">
                <p>O item pesquisado não existe.</p>
                <RouterLink class="icon-link" :to="{ name: 'items' }"><i class="bi bi-arrow-left"></i> Voltar</RouterLink>
            </div>
        </template>
    </Suspense>

</template>
