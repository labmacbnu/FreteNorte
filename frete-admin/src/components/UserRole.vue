<script setup>
import { ref } from 'vue';

defineEmits(["updaterole"])
defineProps({
    role: String,
    label: String
})

const roles = ref(["Usuário", "Administrador", "Líder de Ambiente", "Comissão de Logística"])

</script>
<template> 
<div class="form-floating">
  <select class="form-select" :value="role" id="floatingSelect" aria-label="Floating label select example">
    <option v-for="x in roles">{{ x }}</option>    
  </select>
  <label for="floatingSelect">{{label}}</label>
</div>

</template>