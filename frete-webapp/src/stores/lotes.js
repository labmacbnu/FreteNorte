import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useLotesStore = defineStore('lotes', ()=>{
    const volumesCods = ref([])
    function addVolume(volume){
        volumesCods.value.push(volume)
    }
    function removeVolume(volume){
        volumesCods.value = volumesCods.value.filter( x => x != volume)
    }
    function clear(){
        volumesCods.value = []
    }

    return {
        volumesCods, addVolume, removeVolume, clear
    }

})