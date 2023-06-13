<script setup>
import { RouterLink } from 'vue-router';
import NavLink from './NavLink.vue';
import { reactive } from 'vue';

const links = reactive([{
    rto: { name: 'home' },
    icon: 'bi-house',
    label: "Início"
}, {
    rto: { name: 'items' },
    icon: 'bi-clipboard-check-fill',
    label: "Items"
}, {
    rto: { name: 'pacotes' },
    icon: 'bi-box-seam',
    label: 'Pacotes'
}, {
    rto: { name: 'lotes' },
    icon: 'bi-boxes',
    label: 'Lotes'
}, {
    rto: { name: 'qrcode' },
    icon: 'bi-qr-code-scan',
    label: 'Scanear'
},

])

</script>

<template>
    <nav id="lemanavbar" class="navbar navbar-expand fixed-bottom">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01"
                aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                <ul class="navbar-nav me-auto mb-lg-0">

                    <li class="nav-item px-2" v-for="(dados, n) in links" :key="'navlink' + n" >
                        <NavLink v-bind="dados" ></NavLink>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <NavLink :rto="{ name: 'perfil' }" icon="bi-person" label="Perfil"></NavLink>
                </form>
            </div>
        </div>
    </nav>
</template> 
<style>
#lemanavbar {
    background-color: #8fb2ff;
}

@media (min-width: 1024px) {
    #lemanavbar {
        height: 80px;
        font-size: larger;
    }
}
</style>