<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { db } from '@/backend/index'
import { useDocument, useCollection } from 'vuefire';
import { collection, doc, query, where } from 'firebase/firestore';
import DescricaoTable from '@/components/DescricaoTable.vue';
const route = useRoute()
const short_descricao = route.query.short_descricao


const q = computed(() => query(collection(db, "items"), where('short_descricao', '==', short_descricao)))
const { data: items, pending } = useCollection(q);

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

const unique_descricoes = computed(() => {
    if (items) {
        const descricoes = items.value.map(item => item.detalhes.descricao)
        return descricoes.filter(onlyUnique)
    }
})

const agrupados_por_descricao = computed(() => {
    if (unique_descricoes) {
        const resposta = {}
        unique_descricoes.value.forEach(descricao => {
            resposta[descricao] = items.value.filter(item => item.detalhes.descricao === descricao)
        })
        return resposta
    }
})

const unique_origem = computed(() => {
    if (items) {
        const origens = items.value.map(item => item.origem)
        return origens.filter(onlyUnique)
    }
})


const agrupados_por_descricao_origens = computed(() => {
    if (unique_descricoes && unique_origem) {
        const resposta = {}
        unique_descricoes.value.forEach(descricao => {
            resposta[descricao] = {}
            unique_origem.value.forEach(origem => {
                const n = countByDescricaoOrigem(descricao, origem)
                if (n > 0)
                    resposta[descricao][origem] = n
            })
        })
        return resposta
    }
})

function countByDescricaoOrigem(descricao, origem) {
    return items.value.filter(item => item.detalhes.descricao === descricao && item.origem === origem).length
}

function countByDescricao(descricao){
    return items.value.filter(item => item.detalhes.descricao === descricao).length
}

const active_tab = ref('Resumo')


</script>
<template>
    <template v-if="pending">
        <p>Carregando...</p>
    </template>
    <template v-else>
        <RouterLink class="text-decoration-none icon-link" :to="{ name: 'descricoes-search' }"><i class="bi bi-arrow-left-short"></i> Voltar</RouterLink>
        <h3>{{ short_descricao }}</h3>


        <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
                <a @click.prevent="active_tab = 'Resumo'" :class="{ 'active': active_tab == 'Resumo' }" class="nav-link"
                    href="#Resumo">Resumo</a>
            </li>
            <li class="nav-item">
                <a @click.prevent="active_tab = 'Detalhes'" :class="{ 'active': active_tab == 'Detalhes' }" class="nav-link"
                    href="#Detalhes">Detalhes</a>
            </li>
        </ul>
        <template v-if="active_tab == 'Resumo'">
            <h4>Resumo </h4>
            <ul>
                <template v-for="(value, key) in agrupados_por_descricao_origens" :key="key">
                <li>
                    <strong>Descrição completa:</strong> {{ key }}
                <li><strong>Quantidade total:</strong> {{ countByDescricao(key)}}</li>
                <li><strong>Localizações:</strong></li>
                    <table class="ms-4 mt-2 table table-sm w-25">
                        <thead>
                            <th>Ambiente</th>
                            <th>Quantidade</th>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr v-for="(value, key) in value" :key="key">
                                <td>{{ key }}</td>
                                <td>{{ value }}</td>
                            </tr>
                        </tbody>
                    </table>
                </li>
            </template>
            </ul>
        </template>
        <template v-else>
            <h4>Detalhes</h4>
            <template v-for="(value, key) in agrupados_por_descricao">
                <p> <strong>Descrição completa:</strong> {{ key }}</p>
                <p><strong>Quantidade total:</strong> {{ countByDescricao(key)}}</p>
                <p><strong>Códigos e localizações</strong></p>
                <DescricaoTable class="w-25 ms-4" :items="value"></DescricaoTable>
            </template>
        </template>
    </template>
</template>