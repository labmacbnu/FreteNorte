<script setup>
import { useRoute } from 'vue-router';
import { getFirestore, getDoc, collection, doc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { onBeforeMount, onMounted } from 'vue';
import { useSingleItemStore } from '../stores/singleitem'
import QRCode from '../components/QRCode.vue';

const db = getFirestore(firebaseApp)


const route = useRoute()
const codigo = route.params.codigo

const item = useSingleItemStore()


onBeforeMount(async () => await item.get_item(codigo))

</script>

<template>
    <h4 class="d-print-none">{{ item.short_descricao }}</h4>

    <table class="table d-print-none">
        <tbody>
            <tr>
                <td colspan="2">{{ item.descricao }}</td>
            </tr>
            <tr>
                <th scope="row">Ambiente</th>
                <td>{{ item.ambiente }}</td>
            </tr>
            <tr>
                <th scope="row">Patrimônio</th>
                <td>{{ item.patrimonio }}</td>
            </tr>
            <tr>
                <th scope="row">Valor</th>
                <td>{{ item.valor }}</td>
            </tr>

            <tr>
                <th scope="row">Medidas</th>
                <td><input class="form-control" v-model="item.medidas" disabled></td>
            </tr>

            <tr>
                <th scope="row">Peso</th>
                <td><input class="form-control" v-model="item.peso" disabled></td>
            </tr>
        </tbody>
    </table>
    <h3 class="d-none d-print-block">Sistema Frete Norte</h3>
    <div class="float-start">
        <QRCode :path="route.fullPath"></QRCode>
    </div>
    <div class="float-start">
        <h5>{{ item.short_descricao }}</h5>
        <p><em>Patrimônio</em> {{ item.patrimonio }}</p>
    </div>
</template>
