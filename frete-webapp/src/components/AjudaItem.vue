<template>
    <details class="accordion-item border-bottom-0">
            <summary class="accordion-button">
                <div class="accordion-header user-select-none">{{pergunta}}</div>
            </summary>
            <div class="accordion-body border-bottom">
            <p>{{resposta}}</p>
            </div>
        </details>
</template>
<script setup>
defineProps({
    pergunta: String,
    resposta: String
})
</script>