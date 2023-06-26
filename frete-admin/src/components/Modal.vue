<template>
    <div :id="modalid" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <slot name="titulo"></slot>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" :data-bs-target="modalid" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot name="corpo"></slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :data-bs-target="modalid">Fechar</button>
                    <button type="button" class="btn btn-primary">Salvar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup> 

defineProps({
    modalid: {
        type: String,
        default: "myModal"
    }
})


</script>