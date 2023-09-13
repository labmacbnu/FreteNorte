import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useMensagemStore = defineStore('mensagem', () => {
    const bsToast = ref(null) 

    const mensagem_popup = ref(null)
    const mensagem_level = ref(null)

    function level_classes(level) {
        switch (level) {
            case "info":
            return "bg-light text-dark"
            case "warning":
            return "bg-warning-subtle text-dark"
            case "danger":
            return "bg-danger-subtle text-dark"
            case "success":
            return "bg-success-subtle text-dark"
            default:
            return "bg-body-secondary text-dark"
        }
    } 
 
    /**
     * Mostra uma mensagem de alerta no meio da tela
     * @param {string} mensagem A mensagem a ser exibida no popup
     * @param {"info" | "warning" | "danger" | "success"} level A cor que o popup deve ter
     */
    function set_mensagem_popup(mensagem, level = "info"){
        mensagem_level.value = level_classes(level)
        mensagem_popup.value = mensagem
        const myToastEl = document.getElementById('liveToast') 
        const myToast = bootstrap.Toast.getOrCreateInstance(myToastEl)
        myToast.show()
    } 
})