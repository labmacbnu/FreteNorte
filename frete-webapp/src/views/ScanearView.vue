<script setup>
import { ref } from 'vue';

import QRCodeReader from '../components/QRCodeReader.vue';

const url = ref("")

function update_url(new_url) {
  url.value = new_url
}

</script>

<template>
  Scanear
<QRCodeReader @decoded="update_url" ></QRCodeReader>
<input v-model="url">
</template>
