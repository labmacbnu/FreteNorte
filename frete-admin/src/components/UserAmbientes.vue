<script setup>
import { ref, computed } from 'vue';
import { useListaAmbientes } from '../stores/agregados';

const props = defineProps({ 
    selected: Array[String]
})


 
const emit = defineEmits([
  "add", "remove"
])

const lista_ambientes = useListaAmbientes()

const lista_selecionavel = computed( () => {
  if(lista_ambientes.todos)
    return lista_ambientes.todos.filter( x => !lista_ambientes.liderados.includes(x) && !props.selected.includes(x) )
})

const ambiente_input = ref(null)

function checkadd(){ 
  if(lista_ambientes.todos) {
  const regex = new RegExp(ambiente_input.value, 'i')
  const best_match = lista_selecionavel.value.filter( elem => regex.test(elem) )

  if (best_match.length == 1){ 
    emit("add", best_match[0])
    ambiente_input.value = null
  }
}
}

function checkremove(ambiente){
  lista_ambientes.liderados  = lista_ambientes.liderados.filter( x=> x != ambiente)
  emit('remove', ambiente)
}
 
</script>
<template>  
<div class="mt-3">
<input @keydown.enter="checkadd"  @keydown.tab.prevent="checkadd" v-model="ambiente_input" 
placeholder="Digite para pesquisar, <Enter> para adicionar" class="form-control mb-1" list="ambientes">
<datalist id="ambientes">
  <option v-for="amb in lista_selecionavel">{{ amb }}</option>
</datalist>
<button v-for="ambiente in props.selected" type="button" class="btn btn-primary position-relative m-2">
  {{ ambiente }}
  <span @click="checkremove(ambiente)" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    <i class="bi bi-x"></i>
    <span class="visually-hidden">apagar</span>
  </span>
</button>
</div>
</template>