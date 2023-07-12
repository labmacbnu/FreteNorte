<script setup>
import VueQrcode from 'vue-qrcode';
const baseurl = "https://frete-norte-ufsc-blumenau.web.app"
defineProps({
    path: String
})
</script>
<template> 
<div class="qrcode d-flex-inline">
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
  width: 150px;
  height: 150px;
  float: left;
}
.qrcode img {
  margin: auto;
}
</style>
