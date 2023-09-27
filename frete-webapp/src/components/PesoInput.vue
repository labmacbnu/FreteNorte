<template>
    <div class="input-group">
        <input :class="{ 'border-danger': !validate }" v-model.number="peso" type="number" min="0" step="0.1"
            class="form-control border-0" placeholder="Caso não tenha uma boa estimativa, deixe em branco.">
        <span class="input-group-text border-0">kg</span>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
const emits = defineEmits(['update', 'validate'])
const props = defineProps({
    peso: {
        type: Number,
        default: null
    }
})

const validate = ref(true)
const peso = ref(props.peso | null)

watch(peso, (newValue, oldValue) => { 
    try {
        const input = parseFloat(newValue)
        if (isNaN(input)) {
            peso.value = null
        } else {
            const arredondado = Math.floor(input * 10) / 10
            peso.value = arredondado
        }
        emits('update', peso.value)
    } catch (e) {
        validate.value = false
    }
}) 

watch( () => props.peso, (newVal) => {
    peso.value = newVal
    validate.value = true
}, { immediate: true}
)
</script>