<script setup>
import QuadradoColorido from '@/components/QuadradoColorido.vue';
import provisorios from '@/components/provisorios.json';
import { ref, computed, nextTick } from 'vue';

function find_destino(codigo) {
    return provisorios.alocacoes[codigo]
}

const COLOR1 = {
    '0E': 'blue',
    '0D': 'red',
    '1E': 'yellow',
    '1D': 'black',
}

const COLOR2 = {
    "lime": "verde claro",
    "orange": "laranja",
    "gray": "cinza",
    "green": "verde",
    "navy": "azul marinho",
    "pink": "rosa",
    "brown": "marrom",
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
    return impressao.value ? { altura: '10cm', largura: '20cm' } : { altura: '1cm', largura: '2cm' }
})

function print() {
    window.print()
}

async function handlePrint() {
    impressao.value = true
    await nextTick()
    print()

}

</script>
<template>
    <div class="row d-print-none">
        <div class="col">
            <h1>Código de cores</h1>
        </div>
    </div>
    <div class="d-print-none row">
        <div class="col">
            <p>
                A cor do primeiro quadrado identifica a região do prédio
            </p>
            <table class="table tabelinha align-middle ms-3">
                <thead>
                    <tr>
                        <th colspan="2">Cor</th>
                        <th>Localização</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <QuadradoColorido cor1="blue" cor2="blue" largura="1cm" altura="1cm" />
                        </td>
                        <td style="color: blue;">Azul</td>
                        <td>térreo, lado esquerdo.</td>
                    </tr>
                    <tr>
                        <td>
                            <QuadradoColorido cor1="red" cor2="red" largura="1cm" altura="1cm" />
                        </td>
                        <td style="color: red;">Vermelho</td>
                        <td>térreo, lado direito</td>
                    </tr>
                    <tr>
                        <td>
                            <QuadradoColorido cor1="yellow" cor2="yellow" largura="1cm" altura="1cm" />
                        </td>
                        <td style="color: yellow;">Amarelo</td>
                        <td>1º andar, lado esquerdo</td>
                    </tr>
                    <tr>
                        <td>
                            <QuadradoColorido cor1="black" cor2="black" largura="1cm" altura="1cm" />
                        </td>
                        <td>Preto</td>
                        <td>1º andar, lado direito</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col">
            <p>A segunda cor serve para distinguir as salas em cada região.</p>
            <table class="table tabelinha align-middle">
                <thead>
                    <tr>
                        <th>Cor</th>
                        <th>Nome</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(nome, cor) in COLOR2">
                        <td>
                            <QuadradoColorido :cor1="cor" :cor2="cor" altura="1cm" largura="1cm" />
                        </td>
                        <td>{{ nome }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col me-auto"></div>

    </div>
    <div class="row d-print-none mb-3">
        <div class="col">
            <div class="form-check form-switch">
                <input v-model="impressao" class="form-check-input" type="checkbox" role="switch"
                    id="flexSwitchCheckDefault">
                <label class="form-check-label" for="flexSwitchCheckDefault">Versão para impressão</label>
            </div>
            <p class="my-3">
                <a @click="handlePrint" class="text-primary" role="button">
                    <i class="bi bi-printer"></i>Imprimir
                </a>
            </p>
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
    .linha {
        page-break-inside: avoid;
    }
}

.tabelinha {
    width: fit-content;
}
</style>