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
<style>
details.accordion-item:not([open]) .accordion-button {
  background-color: var(--bs-accordion-bg);
}

details.accordion-item:not([open]):last-of-type .accordion-button {
  border-bottom-right-radius: var(--bs-accordion-border-radius);
  border-bottom-left-radius: var(--bs-accordion-border-radius);
}

details.accordion-item:not([open]) .accordion-button::after {
  background-image: var(--bs-accordion-btn-active-icon);
  transform: unset;
}

details.accordion-item[open] .accordion-button::after {
  background-image: var(--bs-accordion-btn-icon);
  transform: var(--bs-accordion-btn-icon-transform);
}
</style>