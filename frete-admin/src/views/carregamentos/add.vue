<template>
    <div class="row">
        <div class="col-8">
            <h1>Adicionar um carregamento</h1>
        </div>
        <div class="col-4 text-end">
            <RouterLink :to="{ name: 'carregamentos' }" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar
            </RouterLink>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <form>
                <div class="row mb-2">
                    <label for="dataSaida" class="col-sm-2 col-form-label">Data de saída</label>
                    <div class="col-sm-10">
                        <input :class="{'border-danger': !dados_validos.data_saida}" v-model="data_saida" type="datetime-local" class="form-control" id="dataSaida">
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="status" class="col-sm-2 col-form-label">Status</label>
                    <div class="col-sm-10">
                        <select  disabled v-model="novo_carregamento.status" class="form-select" id="status">
                            <option value="agendado">agendado</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="saida" class="col-sm-2 col-form-label">Local de saída</label>
                    <div class="col-sm-10">
                        <select :class="{'border-danger': !dados_validos.saida}"  v-model="novo_carregamento.saida" class="form-select" id="saida">
                            <option value="bloco A">bloco A</option>
                            <option value="bloco B">bloco B</option>
                            <option value="bloco C">bloco C</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="empresa" class="col-sm-2 col-form-label">Empresa</label>
                    <div class="col-sm-10">
                        <select :class="{'border-danger': !dados_validos.empresa}"  v-model="empresa_id" class="form-select" id="empresa" >
                            <option :value="null" disabled selected>Selecione uma empresa</option>
                            <option v-for="e in empresas" :key="e.id" :value="e.id">{{ e.nome }}</option>
                        </select>
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="caminhao" class="col-sm-2 col-form-label">Caminhão</label>
                    <div class="col-sm-10">
                        <select :class="{'border-danger': !dados_validos.caminhao}"  v-model="caminhao_id" class="form-select" id="caminhao">
                            <option :value="null" disabled selected>Selecione uma empresa primeiro</option>
                            <option v-for="c in caminhoes_filtrados" :key="c.id" :value="c.id">{{ c.placa }}</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
        <div class="row">
            <div class="col text-end">
                <button @click="saveCarregamento" class="btn btn-primary">Criar novo carregamento</button>
            </div>
        </div>
    </div> 
</template>
<script setup>
import { reactive, ref, watch, toValue, onMounted, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useCollection } from 'vuefire';
import { db } from '@/backend';
import { collection, getCountFromServer, doc, where, setDoc, orderBy, limit, query } from 'firebase/firestore';
import moment from 'moment'; 

// puxa as empresas
const empresas = useCollection(collection(db, 'empresas'));
const empresa_id = ref(null);
const empresa = ref(null)
watch(empresa_id, (nv, ov) => {
    empresa.value = doc(db, 'empresas', nv)
})


const pesquisa_caminhao = computed(() => query(collection(db, 'caminhoes'), where('empresa', '==', empresa.value)))

const caminhoes = useCollection(collection(db, 'caminhoes'));
const caminhoes_filtrados =  useCollection(pesquisa_caminhao);

const caminhao_id = ref(null)
const caminhao = ref(null)
watch(caminhao_id, (nv, ov) => {
    caminhao.value = doc(db, 'caminhoes', nv)
})

const novo_carregamento = reactive({
    id: null,
    data_saida: null,
    data_criacao: new Date(),
    empresa: empresa,
    caminhao: caminhao,
    status: 'agendado',
    saida: null
})

const dados_validos = reactive({
    data_saida: true,
    empresa: true,
    caminhao: true,
    saida: true
})

// data saída 
const data_saida = ref(null)

watch(data_saida, (nv, ov) => {
    novo_carregamento.data_saida = moment(`${nv}-0300`).toDate()
})

const router = useRouter()

async function saveCarregamento() {
    if (!validarEntradas()) {
        console.log('Dados inválidos')
        setTimeout(() => {
            Object.assign(dados_validos, {
                data_saida: true,
                empresa: true,
                caminhao: true,
                saida: true
            })
        }, 2000)
        return
    }
    const valores = toValue(novo_carregamento) 
    console.log(valores)
    const newdoc = doc(db, 'carregamentos', valores.id)
    await setDoc(newdoc, valores);
    console.log('carregamento salvo')
    router.push({ name: 'carregamentos' })
}

async function idUltimoCarregamento() {
    const pesquisa = query(collection(db, "carregamentos"), orderBy('data_criacao', 'desc'), limit(1));
    const {data: ultimo, promise} = useCollection(pesquisa, { maxRefDepth: 0 }); 
    await promise.value
    if (ultimo.value.length === 0) {
        return 'C0000'
    }
    return ultimo.value[0].id

}

function validarEntradas(){
    dados_validos.data_saida = novo_carregamento.data_saida !== null
    dados_validos.empresa = novo_carregamento.empresa !== null
    dados_validos.caminhao = novo_carregamento.caminhao !== null
    dados_validos.saida = novo_carregamento.saida !== null
    return Object.values(dados_validos).every(v => v)
}

function hexToDecimal(hexString) {
    // Verifica se a string tem o formato correto
    if (/^C[0-9A-Fa-f]{4}$/.test(hexString)) {
        // Extrai o número hexadecimal da string
        const hexNumber = hexString.slice(1);
        // Converte o número hexadecimal para decimal e retorna
        return parseInt(hexNumber, 16);
    } else {
        throw new Error('A string fornecida não está no formato correto.');
    }
}

onMounted(async () => {
    var ultimo_id = await idUltimoCarregamento()
    var N = hexToDecimal(ultimo_id)
    N++
    const code = N.toString(16).padStart(4, '0')
    const new_id = `C${code}`
    console.log(`Novo ID: ${new_id}`)
    novo_carregamento.id = new_id
})


</script>