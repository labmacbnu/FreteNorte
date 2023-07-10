<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router' 

import QRCodeReader from '../components/QRCodeReader.vue';
const router = useRouter() 

function update_url(new_url) {
  const prefix = "https://frete-norte-ufsc-blumenau.web.app"
  if(new_url.startsWith(prefix))
  {
    const fullPath = new_url.replace(prefix, "") 
    setTimeout(() => router.push(fullPath), 1200)
  }
}

</script>

<template>
  <div class="row">
    <div class="col">
      <QRCodeReader @decoded="update_url"></QRCodeReader>
    </div>
  </div> 
</template>
