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
      :size="400" type="image/png"
      ></VueQrcode>
</div>
</template>
<style>
.qrcode {
  width: fit-content;
  height: fit-content;
}
/* .qrcode img {
  margin: auto;
} */
</style>
