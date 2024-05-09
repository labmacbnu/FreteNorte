<template>
    <div class="quadradoWrapper" 
    :style="{width: largura, height: altura}"> 
        <div class="quadrado" :style="{backgroundColor: cor1}"></div>
        <div class="quadrado" :style="{backgroundColor: cor2}"></div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
defineProps({
    cor1: {
        type: String,
        default: 'red'
    },
    cor2: {
        type: String,
        default: 'blue'
    },
    largura: {
        type: String,
        default: '100%'
    },
    altura: {
        type: String,
        default: '50px'
    }

})
</script>
<style scoped> 
.quadrado{
    width: 50%; 
    height: 100%;
    display: inline-block;
}
</style>