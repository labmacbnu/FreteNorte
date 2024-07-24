import { ref, watch } from 'vue'
import { defineStore } from 'pinia'


export const useLotesStore = defineStore('lotes', ()=>{

    const volumesCods = ref([])
    if(localStorage.getItem('volumesCods')){
        volumesCods.value = JSON.parse(localStorage.getItem('volumesCods'))
    }

    watch(() => volumesCods.value, (newValue, oldValue)=>{ 
        localStorage.setItem('volumesCods', JSON.stringify(newValue))
    }, {deep: true})  

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