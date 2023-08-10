<template>
    <div :id="props.modalid" class="modal" tabindex="-1">
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
                    <button :id="'close-' + props.modalid" type="button" class="btn btn-secondary" data-bs-dismiss="modal" :data-bs-target="modalid">Fechar</button>
                    <button type="button" @click="callback_and_close" class="btn btn-danger">Deletar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup> 

const props  = defineProps({
    modalid: {
        type: String,
        default: "myModal"
    },
    delete_callback: Function
})
 

async function callback_and_close(){
    const check = await props.delete_callback()
    if(check){
        const closebutton = document.getElementById(`close-${props.modalid}`)
        closebutton.click()
    }
}

</script>