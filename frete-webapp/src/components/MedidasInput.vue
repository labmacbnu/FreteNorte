<script setup>
import { reactive, watch } from 'vue';

const emits = defineEmits(['update', 'validate'])
const props = defineProps({ 
    inner_validate: false,
})

const validation = reactive({
    c: true,
    l: true,
    a: true 
})

const medidas = reactive({
    c: null,
    l: null,
    a: null
})

function valida_inteiros(key_event) {
  const digito_regex = /\d/g 
  // Se precionar backspace, delete, tab, enter, arrow left ou arrow right, permite
  const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Enter']
  if (allowed.includes(key_event.key)) {
    return
  }
  // Se precionar qualquer outra coisa que não seja um dígito, não permite
  if ( !digito_regex.test(key_event.key) ) {
    key_event.preventDefault()
  }
}

function validate_medidas() {
    validation.c = medidas.c != null && medidas.c != ""
    validation.l = medidas.l != null && medidas.l != ""
    validation.a = medidas.a != null && medidas.a != "" 
}

watch(medidas,() => {
    validate_medidas()
    const tudo_valido = Object.values(validation).reduce( (a,b) => a && b, true )
    if(tudo_valido) emits('update', medidas) 
    emits('validate', tudo_valido)
},
{ deep: true })
</script>
<template>
     <div class="input-group">
        <input :class="{ 'border-danger': !validation.c && props.inner_validate }"  @keydown=" x => valida_inteiros(x)" placeholder="Comprimento" v-model.number="medidas.c" type="number" min="0" step="1" class="form-control border-0">
        <span class="input-group-text p-1 border-0">x</span>
        <input :class="{ 'border-danger': !validation.l && props.inner_validate }"  @keydown=" x => valida_inteiros(x)"  placeholder="Largura" v-model.number="medidas.l" type="number" min="0" step="1" class="form-control border-0">
        <span class="input-group-text  p-1 border-0">x</span>
        <input :class="{ 'border-danger': !validation.a && props.inner_validate }"  @keydown=" x => valida_inteiros(x)" placeholder="Altura" v-model.number="medidas.a" type="number" min="0" step="1" class="form-control border-0">
        <span class="input-group-text px-2 border-0">cm</span>
      </div>
</template>