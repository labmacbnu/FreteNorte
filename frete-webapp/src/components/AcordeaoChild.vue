<template>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed"   type="button" data-bs-toggle="collapse" :data-bs-target="'#'+aid" :aria-controls="aid">
                <slot name="titulo"></slot>
            </button>
        </h2>
        <div :id="aid" class="accordion-collapse collapse" :data-bs-parent="'#'+pai">
            <div class="accordion-body"> 
                <slot name="corpo"></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps({ 
    pai: String,
    aid: String, 
})
</script>
