<script setup>
import VueQrcode from 'vue-qrcode';
const baseurl = "https://frete-norte-ufsc-blumenau.web.app"
defineProps({
    path: String
})
</script>
<template> 
<div class="qrcode">
<VueQrcode :color="{
        dark: '#000',
        light: '#FFF'
      }" 
      :value="baseurl + path"
      :size="200" type="image/png"
      errorCorrectionLevel="M"
      :version="5"
      :margin="1"
      :scale="3"
      ></VueQrcode>
</div>
</template>
<style>
.qrcode {
  width: fit-content;
  height: fit-content;
} 
</style>
