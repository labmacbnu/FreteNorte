<template>
    <div id="qrcodereader">
        <qrcode-stream :track="paintOutline" :camera="camera" @decode="onDecode">
            <div v-if="lido" class="overlay position-relative">
                <div class="position-absolute top-50 start-50 translate-middle">
                    <slot></slot>
                </div>
            </div>
        </qrcode-stream>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader-vue3';

const emit = defineEmits(['decoded'])
const props = defineProps({'autoreload': {type: Boolean, default: false}})

const camera = ref("auto");
const url = ref("")
const lido = ref(false);

function turnoff_camera() {
    camera.value = "off"
    lido.value = true
}

function turnon_camera() {
    camera.value = "auto"
    lido.value = false
}

function onDecode(result) {
    const regex = /https\/\//i
    const correcturl = result.replace(regex, 'https://').replace(/\s*/i, "")
    url.value = correcturl
    emit('decoded', correcturl)
    turnoff_camera()
    if(props.autoreload){
        setTimeout(() => turnon_camera(), 400)
    } 
}

function paintOutline(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

        ctx.strokeStyle = "red";

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const { x, y } of otherPoints) {
            ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
    }
}
</script>
<style>
@media (max-width: 700px) {
    #qrcodereader {
        width: 80vw;
        height: 50vh;
        margin: auto;
    }
}

@media (min-width: 700px) {
    #qrcodereader {
        width: 560px;
        height: 600px;
        margin: auto;
    }
}

#qrcodereader .overlay {
    height: 50vh;
    vertical-align: middle;
    text-align: center;
    background: rgba(137, 250, 114, 0.5);
}

#qrcodereader .overlay span {
    position: inherit;
}
</style>