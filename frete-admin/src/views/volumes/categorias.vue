<script setup>
import { db } from '@/backend/index'
import { useDocument } from 'vuefire';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const catRef = doc(db, 'agregados/categorias_volumes')
const {data: categorias, pending } = useDocument(catRef)

function add_categoria(categoria){
    updateDoc(catRef, {valores: arrayUnion(categoria)})
}

function remove_categoria(categoria){
    updateDoc(catRef, {valores: arrayRemove(categoria)})
}

const nova_categoria = ref("")

function inputa(){
    console.log('Adicionado', nova_categoria.value)
    add_categoria(nova_categoria.value)
    nova_categoria.value = ''
}
function deleta(i){
    const para_deletar = categorias.value.valores[i]
    console.log('Deletado', para_deletar)
    remove_categoria(para_deletar)
}
</script>

<template>
    <RouterLink class="text-decoration-none" :to="{name: 'volumes'}"> <i class="bi bi-caret-left-fill  me-2"></i>Voltar</RouterLink>
    <h3>Categorias dos volumes</h3> 
    <template v-if="!pending">
    <ul class="list-group">
        <li class="list-group-item">
            <input v-model="nova_categoria" @keypress.enter="inputa" class="form-control" placeholder="Digite uma nova categoria, pressione enter para adicionar">
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center"
         v-for="(categoria, idx) in categorias.valores">
         {{ categoria }}
         <span role="button" class="badge bg-danger rounded-pill"
         @click="deleta(idx)"><i class="bi bi-trash fs-3"></i></span>
        </li>
    </ul>
    </template>
</template>