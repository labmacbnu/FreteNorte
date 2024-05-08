<script setup>
import QRCode from '@/components/QRCode.vue'
import AmbienteFlag from '@/components/AmbienteFlag.vue';
import moment from 'moment'
import VMedidasDisplay from '@/components/VMedidasDisplay.vue'
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
            <div class="col-md-6 col-12">
                <div class="vstack gap-2  align-items-start">
                    <div class="hstack  align-items-start">
                        <div class="vstack">
                            <small class="ms-auto me-auto">{{ volume.codigo }}</small>
                            <QRCode class="ms-auto me-auto" :path="'/volumes/cod/' + volume.codigo"></QRCode>
                        </div>
                        <div class="w-75">
                            <h5><i class="bi bi-truck fs-3 me-2"></i>Transporte</h5>
                            <div class="hstack gap-2  justify-content-evenly mb-3">
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

                            <div class="hstack gap-3">
                                <div class="me-4">
                                    <h5><i class="bi bi-rulers fs-3 me-2"></i>Medidas</h5>
                                        <VMedidasDisplay v-bind="volume.medidas"></VMedidasDisplay>
                                </div>
                                <div class="ms-4">
                                    <h5><i class="bi bi-wrench-adjustable fs-3 me-2"></i>Peso</h5>
                                        <div class="">{{ volume.peso }} kg</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-1"> <!-- propriedades labels -->
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
            <div class="col-md-6 col-12">
                <h3>{{ volume.categoria }}</h3>
                <p class="mb-1"><b>Responsável:</b> {{ volume.responsavel.nome }}</p>
                <p class="fw-bold mb-0">Lista de itens</p>
                <ul class="list-group mb-2">
                    <li class="list-group-item justify-content-between d-flex" v-for="item in volume.items">
                        <span>
                            {{ item.descricao ? item.descricao : item.short_descricao }}
                        </span>
                        <RouterLink title="Link para o item" :to="{name: 'item-codigo', params: {codigo: item.key }}" class="bagde text-decoration-none">{{ item.key }}<i class="bi-link bi ms-1 d-print-none"></i></RouterLink>
                    </li>
                </ul>
                <template v-if="volume.observacao">
                    <p class="fw-bold mb-0">Observação:</p>
                    <p>{{ volume.observacao }}</p>
                </template>
                <p class="fw-bold mb-2">Embalagem</p>
                <div class="ms-3">
                <p class="mb-1"> 
                    Enchimento: {{ volume.embalagem.enchimento ? "Sim" : "Não" }}
                </p>
                <p class="mb-1">
                    Plástico bolha: {{ volume.embalagem.platico_bolha ? volume.embalagem.platico_bolha + "m": 'Não' }}
                </p>
                <p class="mb-1">
                   Caixa: {{ volume.embalagem.caixa ? volume.embalagem.caixa : 'Não' }} 
                </p>
                </div>
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