<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router' 

import QRCodeReader from '@/components/QRCodeReader.vue';
const router = useRouter() 


const lote = ref([])

function update_url(new_url) {
  const prefix = "https://frete-norte-ufsc-blumenau.web.app"
  if(new_url.startsWith(prefix))
  {
    const fullPath = new_url.replace(prefix, "") 
    lote.value.push(fullPath)
  }
}
</script>

<template>
  <div class="row">
    <div class="col">
      <QRCodeReader :autoreload="true" @decoded="update_url"></QRCodeReader>
    </div>
  </div> 
    <div class="row">
        <div class="col">
        <h2>Lista de lotes</h2>
        <ul>
            <li v-for="l in lote">{{l}}</li>
        </ul>
        </div>
    </div>
</template>
