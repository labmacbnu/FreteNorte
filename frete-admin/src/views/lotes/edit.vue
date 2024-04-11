<template>
    <div class="row">
        <div class="col-8">
            <h1>Editar o carregamento {{ carregamento_id }}</h1>
        </div>
        <div class="col-4 text-end">
            <RouterLink :to="{ name: 'lotes' }" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar
            </RouterLink>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <form v-if="!pending">
                <div class="row mb-2">
                    <label for="dataSaida" class="col-sm-2 col-form-label">Data de saída</label>
                    <div class="col-sm-10">
                        <input v-model="data_saida" type="datetime-local" class="form-control" id="dataSaida">
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="status" class="col-sm-2 col-form-label">Status</label>
                    <div class="col-sm-10">
                        <select v-model="carregamento.status" class="form-select" id="status">
                            <option v-for="status in OPCOES_STATUS" :key="status" :value="status">{{ status }}</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="saida" class="col-sm-2 col-form-label">Local de saída</label>
                    <div class="col-sm-10">
                        <select v-model="carregamento.saida" class="form-select" id="saida">
                            <option value="bloco A">bloco A</option>
                            <option value="bloco B">bloco B</option>
                            <option value="bloco C">bloco C</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="empresa" class="col-sm-2 col-form-label">Empresa</label>
                    <div class="col-sm-10">
                        <select v-model="empresa_id" class="form-select" id="empresa">
                            <option v-for="e in empresas" :key="e.id" :value="e.id">{{ e.nome }}</option>
                        </select>
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="caminhao" class="col-sm-2 col-form-label">Caminhão</label>
                    <div class="col-sm-10">
                        <select v-model="caminhao_id" class="form-select" id="caminhao">
                            <option :value="null" disabled selected>Selecione uma empresa</option>
                            <option v-for="c in caminhoes_filtrados" :key="c.id" :value="c.id">{{ c.placa }}</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
        <div class="row">
            <div class="col">
                <button v-if="n==0" :disabled="n > 0" @click="deletaCarregamento" class="btn btn-danger">Apagar
                    carregamento</button>
            </div>
            <div class="col text-end">
                <button title="Clique para salvar as alterações" @click="editCarregamento"
                    class="btn btn-primary">Salvar alterações</button>
            </div>
        </div>
    </div>
    <div class="row mt-4">
        <div class="col-8">
            <div class="accordion" id="statusDescription">
                <div class="accordion-item">
                    <h5 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            O que significam os status?
                        </button>
                    </h5>
                    <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#statusDescription">
                        <div class="accordion-body">

                            <dl>
                                <dt>agendado</dt>
                                <dd>É o estado inicial de todo carregamento.</dd>
                                <dt>carregando</dt>
                                <dd>Quando o caminhão está no campus sendo carregado.</dd>
                                <dt>carregado</dt>
                                <dd>Quando o caminhão já está carregado e pronto para sair.</dd>
                                <dt>descarregando</dt>
                                <dd>Quando o caminhão está descarregando no novo campus.</dd>
                                <dt>finalizado</dt>
                                <dd>Quando o carregamento foi finalizado.</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, watch, toValue, onMounted, computed } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useCollection, useDocument } from 'vuefire';
import { db } from '@/backend';
import { collection, getCountFromServer, doc, where, updateDoc, deleteDoc } from 'firebase/firestore';
import moment from 'moment';
import { query } from 'firebase/database';
import { getLotesFromCarregamento } from '@/stores/lotes'



const route = useRoute()
const carregamento_id = ref(route.params.id)

const { data: carregamento, promise, pending } = useDocument(doc(db, 'carregamentos', carregamento_id.value), { maxRefDepth: 0 });



// puxa as empresas
const empresas = useCollection(collection(db, 'empresas'));
const empresa_id = ref(null);
const empresa = ref(null)
watch(empresa_id, (nv, ov) => {
    empresa.value = doc(db, 'empresas', nv)
})


const pesquisa_caminhao = computed(() => query(collection(db, 'caminhoes'), where('empresa', '==', empresa.value)))

const caminhoes = useCollection(collection(db, 'caminhoes'));
const caminhoes_filtrados = useCollection(pesquisa_caminhao);

const caminhao_id = ref(null)
const caminhao = ref(null)

watch(caminhao_id, (nv, ov) => {
    caminhao.value = doc(db, 'caminhoes', nv)
})



// data saída 
const data_saida = ref(null)


watch(data_saida, (nv, ov) => {
    carregamento.data_saida = moment.utc(nv).toDate()
})




const router = useRouter()

async function editCarregamento() {
    const valores = toValue(carregamento)
    valores.caminhao = caminhao.value
    valores.empresa = empresa.value
    console.log(valores)
    const docRef = doc(db, 'carregamentos', carregamento_id.value)
    await updateDoc(docRef, valores)
    console.log('carregamento salvo')
    router.push({ name: 'lotes' })
}

async function deletaCarregamento(){
    const docRef = doc(db, 'carregamentos', carregamento_id.value)
    await deleteDoc(docRef, {status: 'deletado'})
    console.log(`Carregamento ${carregamento_id.value} deletado`)
    router.push({ name: 'lotes' })
}

async function contarCarregamentos() {
    const coll = collection(db, "carregamentos");
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count
}


const OPCOES_STATUS = ['agendado', 'carregando', 'carregado', 'descarregando', 'finalizado']

/// Quando carregar o objeto, vamos fazer uns settings
promise.value.then(() => {
    data_saida.value = moment.unix(carregamento.value.data_saida.seconds).format('YYYY-MM-DDTHH:mm')
    const empresa_ref = carregamento.value.empresa
    const caminhao_ref = carregamento.value.caminhao
    empresa_id.value = empresa_ref.split('/')[1]
    caminhao_id.value = caminhao_ref.split('/')[1]
})

const n = ref(1_000_000)
onMounted(async () => {
    n.value = await getLotesFromCarregamento(carregamento_id.value)
})

</script>