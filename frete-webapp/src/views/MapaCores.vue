<script setup>
import QuadradoColorido from '@/components/QuadradoColorido.vue';
import provisorios from '@/components/provisorios.json';
import { ref, computed } from 'vue';

function find_destino(codigo) {
    return provisorios.alocacoes[codigo]
}

const COLOR1 = {
    '0E': 'blue',
    '0D': 'red',
    '1E': 'yellow',
    '1D': 'black',
}

function cor1(destino) {
    const amb_destino = provisorios.ambientes[destino]
    return COLOR1[`${amb_destino.andar}${amb_destino.lado}`]
}

function cor2(destino) {
    return provisorios.ambientes[destino].cor
}

const impressao = ref(false)

const tamanhos = computed(() => {
    return impressao.value ?  { altura: '10cm', largura: '20cm' } : { altura: '1cm', largura: '2cm' }
})

</script>
<template>
    <div class="d-print-none">
        <div class="form-check form-switch">
            <input v-model="impressao" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
            <label class="form-check-label" for="flexSwitchCheckDefault">Versão para impressão</label>
        </div>
    </div>
    <template v-for="destino, origem in provisorios.alocacoes">
        <div class="linha">
            <h3 class="mb-1">
                {{ origem }} <i class="bi bi-arrow-right"></i> {{ destino }}
            </h3>
            <QuadradoColorido :cor1="cor1(destino)" :cor2="cor2(destino)" :altura="tamanhos.altura"
                :largura="tamanhos.largura"></QuadradoColorido>
        </div>
    </template>
</template>
<style scoped> 
@media print {
    .linha{
        page-break-inside: avoid;
    }
}
</style>