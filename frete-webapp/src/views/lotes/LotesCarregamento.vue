<script setup>
import { computed, ref, toValue, inject } from 'vue';
import { useLotesStore } from '@/stores/lotes';
import CarregamentoShow from '@/components/CarregamentoShow.vue';
import { useCollection } from 'vuefire'
import { useRouter } from 'vue-router'
import { db } from '@/backend/index'
import { collection, query, where, doc, setDoc } from 'firebase/firestore'

const {globaluser, updateUser} = inject('globaluser')
const router = useRouter()
const lotes = useLotesStore()
 
//const carregamentos = useCollection(query(collection(db, 'carregamentos'), where("status", 'in', ["agendado", "carregando"])))

//const carregamento_selecionado = ref(null)

const nome_lote = ref("")
const nome_invalido = ref(false)

async function registerLoteCarregamento(){
    const dados  = {
        volumes: lotes.volumesCods.map(x => doc(db, 'volumes', x)),
        carregamento: doc(db, 'carregamentos', "C0000"),
        data_criado: new Date(),
        responsavel: doc(db, 'usuarios', globaluser.value.email),
        tipo: "Carregamento",
        nome: nome_lote.value,
        n_volumes: lotes.volumesCods.length
    }
    console.log("Lote registrado") 
    const new_id = (dados.data_criado.getTime()).toString(36).toUpperCase() 
    const new_docref = doc(db, 'lotes', new_id)
    await setDoc(new_docref, dados)
    lotes.clear()
    router.push({name: 'lotes-home'})
}
 
function handleRegistro(){ 
    if(nome_lote.value == ""){
        nome_invalido.value = true
        setTimeout(() => {
            nome_invalido.value = false
        }, 2000)
    } else {
        registerLoteCarregamento()
        nome_lote.value = ""
    }
}

</script>
<template>
<div class="row">
    <div class="col-12">
        <h1>Designar carregamento</h1>
    </div>
    <div class="col-sm-12 col-md-6 mt-2">
        <h4>Volumes</h4>
        <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="l in lotes.volumesCods">
          {{ l }} 
        </li>
      </ul>
    </div>
    <div class="col-sm-12 col-md-6 mt-2">
        <h4>Nome do lote</h4>  
        <p v-if="nome_invalido" class="my-0 text-danger">Nome do lote não pode ser vazio.</p>
        <p v-else class="my-0 text-secondary">Digite um nome para identificar o lote.</p>
            <input type="text" class="form-control" v-model="nome_lote" placeholder="Cadeiras, mesas, armários, etc..."
            :class="{'border-danger': nome_invalido}" /> 
    </div>

    <div class="col-12 text-center pt-3">
        <RouterLink :to="{name: 'lotes-scan'}" class="btn btn-primary"><i class="bi bi-caret-left"></i> Voltar</RouterLink>
        <button @click="handleRegistro" class="btn btn-success ms-3">Registrar lote</button>
    </div>
</div> 
</template>