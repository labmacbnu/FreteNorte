<script setup>
import { useRoute } from 'vue-router';


defineProps({
    rto: Object,
    icon: String,
    label: String
})

const route = useRoute()

//const isactive
</script>

<template>
        <RouterLink class="nav-link" aria-current="page" :to="rto">
            <div class="text-sm-center navlinkdiv">
                <i class="bi" :class="[icon]"></i> <span class="label">{{ label }}</span>
            </div>
        </RouterLink> 
</template>

<style> 
/* // Small devices (landscape phones, 576px and up) */
.router-link-active {
    font-weight: 600;
}
.navlinkdiv { 
    text-align: center;
} 
@media (max-width: 500px) { 
.navlinkdiv {
    font-size: 14pt;
}
.label {
        display: none;
    }

}
@media (min-width: 768px) { 
.navlinkdiv {
    font-size: 16pt;
}
}
</style>