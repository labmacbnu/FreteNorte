<script setup>
import { ref, computed } from 'vue'; 

const props = defineProps({ 
    selected: Array[String],
    unselectable: Array[String],
    all: Array[String]
})


 
const emit = defineEmits([
  "add", "remove"
])
 

const lista_selecionavel = computed( () => { 
  if(props.all)
    return props.all.filter( x => !props.selected.includes(x)  && !props.unselectable.includes(x) )
})

const ambiente_input = ref(null)

function checkadd(){ 
  if(props.all) {
  const regex = new RegExp(ambiente_input.value, 'i')
  const best_match = lista_selecionavel.value.filter( elem => regex.test(elem) )
  if (best_match.length == 1){ 
    emit("add", best_match[0])
    ambiente_input.value = null
  }
}
}

function checkremove(ambiente){  
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