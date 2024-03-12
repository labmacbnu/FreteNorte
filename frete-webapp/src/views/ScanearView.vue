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
      <QRCodeReader @decoded="update_url">
        <h3>QR Code lido com sucesso</h3>
                    <p>Redirecionando para a página correspondente.</p> 
      </QRCodeReader>
    </div>
  </div> 
</template>
