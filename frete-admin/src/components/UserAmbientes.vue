<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useListaAmbientes } from '../stores/agregados';

const props = defineProps({ 
    selected: Array[String]
})


 
const emit = defineEmits([
  "add", "remove"
])

const lista_ambientes = useListaAmbientes()

const lista_selecionavel = computed( () => {
  return lista_ambientes.dados.filter( x => !props.selected.includes(x) )
})

const ambiente_input = ref(null)

function checkadd(){ 
  if (lista_selecionavel.value.includes(ambiente_input.value)){
    emit("add", ambiente_input.value)
    ambiente_input.value = null
  }

}

onBeforeMount(lista_ambientes.load_data)
</script>
<template>  
<div class="mt-3">
<input @keydown.enter="checkadd" v-model="ambiente_input" 
placeholder="Digite para pesquisar, <Enter> para adicionar" class="form-control mb-1" list="ambientes">
<datalist id="ambientes">
  <option v-for="amb in lista_selecionavel">{{ amb }}</option>
</datalist>
<button v-for="ambiente in props.selected" type="button" class="btn btn-primary position-relative m-2">
  {{ ambiente }}
  <span @click="emit('remove', ambiente)" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    <i class="bi bi-x"></i>
    <span class="visually-hidden">apagar</span>
  </span>
</button>
</div>
</template>