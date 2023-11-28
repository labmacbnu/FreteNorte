<script setup>
import QRCode from '@/components/QRCode.vue'
import AmbienteFlag from '@/components/AmbienteFlag.vue';
import moment from 'moment'
import { simbolos_nbr } from '@/stores/volumes'
import { useRoute } from 'vue-router';

const route = useRoute()

defineProps({
    volume: {
        type: Object,
        required: true
    }
})
</script>
<template>
    <div class="conteudo  border-bottom border-dark pt-2 mt-2">
        <div class="row">
            <div class="col-6">
                <div class="vstack gap-2  align-items-start">
                    <div class="hstack  align-items-start">
                        <div class="vstack">
                            <small class="ms-auto me-auto">{{ volume.codigo }}</small>
                            <QRCode class="ms-auto me-auto" :path="'/volumes/cod/' + volume.codigo"></QRCode>
                        </div>
                        <div class="w-75">
                            <h5><i class="bi bi-truck fs-3 me-2"></i>Transporte</h5>
                            <div class="hstack gap-2  justify-content-evenly">
                                <p class="text-center mb-1"><b>Origem</b>
                                    <AmbienteFlag v-bind="volume.origem"></AmbienteFlag>
                                </p>
                                <i class="bi bi-arrow-right"></i>
                                <p class="px-3 align-self-top text-center mb-1 d-print-none"><b>Atual</b>
                                    <AmbienteFlag v-bind="volume.localizacao_atual"></AmbienteFlag>
                                </p>
                                <i class="bi bi-arrow-right d-print-none"></i>
                                <p class="text-center mb-1"><b>Destino</b>
                                    <AmbienteFlag v-bind="volume.destino"></AmbienteFlag>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div> <!-- propriedades labels -->
                        <template v-for="(valor, key) in simbolos_nbr">
                            <template v-if="volume.propriedades?.includes(key)">
                                <figure class="figure text-center mx-1">
                                    <img :src="valor" :title="key" :alt="key" class="figure-img img-fluid"
                                        style="max-width: 96px; max-height: 96px; object-fit: contain; object-position: center;" />
                                    <figcaption class="figure-caption text-center">{{ key }}</figcaption>
                                </figure>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <h3>{{ volume.categoria }}</h3>
                <p class="mb-1"><b>Responsável:</b> {{ volume.responsavel.nome }}</p>
                <p class="fw-bold mb-0">Lista de itens</p>
                <ul class="list-group mb-2">
                    <li class="list-group-item justify-content-between d-flex" v-for="item in volume.items">
                        <span>
                            {{ item.descricao ? item.descricao : item.short_descricao }}
                        </span>
                        <span class="bagde text-secondary">{{ item.key }}</span>
                    </li>
                </ul>
                <template v-if="volume.observacao">
                    <p class="fw-bold mb-0">Observação:</p>
                    <p>{{ volume.observacao }}</p>
                </template>
            </div>

        </div>
    </div>
</template>
<style> @media print {
     div.conteudo {
         break-inside: avoid;
     }
 }
</style>