<script setup>
import UserRole from '../components/UserRole.vue';
import Modal from '../components/Modal.vue';
import UserAmbientes from '../components/UserAmbientes.vue';
import { onBeforeMount, ref, computed } from 'vue';
import { useUsuariosStore } from '../stores/users';

const usuarios = useUsuariosStore()
const selectmail = ref(false)

const user_edit = computed( () => { 
    if(selectmail.value && usuarios.usuarios ) {
    return  usuarios.usuarios[selectmail.value]  
} else {
    return {nome: "", email: "", role: "", ambientes: []}
}
})

function update_role(email, role){
    usuarios.usuarios[email].role = role
}


function add_ambiente(email, ambiente){
    usuarios.usuarios[email].ambientes.push(ambiente)
}



function remove_ambiente(email, ambiente){
    const filtrado = usuarios.usuarios[email].ambientes.filter( x=> x !== ambiente)
    usuarios.usuarios[email].ambientes = filtrado 
    
}

function update_user(email){
    const referencia = usuarios.usuarios[email]
    usuarios.update_user(referencia)
}

onBeforeMount(async () => await usuarios.load_data())
</script>
<template>
    <Modal modalid="BossaModal" :salve_callback="() => update_user(user_edit.email)">
 <template #titulo>Editar usuário</template>
 <template #corpo>
    <div class="mb-3">
    <label for="nome" class="form-label">Nome</label>
    <input :value="user_edit.nome" type="text" class="form-control" id="nome" disabled>
    </div> 

    <div class="mb-3">
    <label for="email" class="form-label">e-mail</label>
    <input :value="user_edit.email" type="text" class="form-control" id="email" disabled>
    </div> 

    <div class="mb-3">
    <label for="perfil" class="form-label">Perfil</label>
    <UserRole id="perfil" :role="user_edit.role" label="Perfil"
    @updaterole="(x) => update_role(user_edit.email, x)"
    ></UserRole>
    </div>  

    <div class="mb-3">
    <label for="ambientes" class="form-label">Ambientes</label> 
        <UserAmbientes 
            @remove="(x) => remove_ambiente(user_edit.email, x)"
            @add="(x) => add_ambiente(user_edit.email, x)"
            :selected="user_edit.ambientes"></UserAmbientes>

    </div>  
</template>
    </Modal>
    <table class="table">
        <thead>
            <tr>
                <th>Nome</th>
                <th>e-mail</th>
                <th>Perfil</th>
                <th>Ambientes</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="5"><input placeholder="Digite para pesquisar" class="form-control" ></td>
                
            </tr>
            <tr v-for="(user, email) in usuarios.usuarios">
                <td> {{ user.nome }} </td>
                <td> <code>{{ user.email }}</code> </td>
                <td> {{ user.role }} </td>
                <td> <span class="badge text-bg-primary m-1" v-for="x in user.ambientes">{{x}}</span></td>
                <td> <button class="btn btn-secondary no-wrap" data-bs-target="#BossaModal" data-bs-toggle="modal"
                    @click="() => selectmail = user.email"><i class="bi bi-pencil"></i></button> </td>
            </tr>
        </tbody>
    </table>
</template>