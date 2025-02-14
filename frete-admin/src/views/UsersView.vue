<script setup>
import UserRole from '@/components/UserRole.vue';
import Modal from '@/components/Modal.vue';
import UserAmbientes from '@/components/UserAmbientes.vue';
import { ref, computed, reactive, toRaw } from 'vue';
import { useUsuariosStore } from '@/stores/users';
import { useListaAmbientes } from '@/stores/agregados'; 

const usuarios = useUsuariosStore()
const selectmail = ref(false)
const lista_ambientes = useListaAmbientes()

const user_edit = computed(() => {
    if (selectmail.value && usuarios.usuarios) {
        return usuarios.usuarios[selectmail.value]
    } else {
        return { nome: "", email: "", role: "", ambientes: [], usuario_de: [] }
    }
})

function update_role(email, role) {
    usuarios.usuarios[email].role = role
}


function add_lider_ambiente(email, ambiente) {
    usuarios.usuarios[email].ambientes.push(ambiente)
    usuarios.edit_array.push(["add_lider", email, ambiente])
}

function add_user_ambiente(email, ambiente) {
    usuarios.usuarios[email].usuario_de.push(ambiente)
    usuarios.edit_array.push(["add_user", email, ambiente])
}



function remove_lider_ambiente(email, ambiente) {
    const filtrado = usuarios.usuarios[email].ambientes.filter(x => x !== ambiente)
    usuarios.usuarios[email].ambientes = filtrado
    usuarios.edit_array.push(["remove_lider", email, ambiente])
}


function remove_user_ambiente(email, ambiente) {
    const filtrado = usuarios.usuarios[email].usuario_de.filter(x => x !== ambiente)
    usuarios.usuarios[email].usuario_de = filtrado
    usuarios.edit_array.push(["remove_user", email, ambiente])
}


async function update_user(email) {
    const referencia = usuarios.usuarios[email]
    const uptime = await usuarios.update_user(referencia)
    return true
}

const pesquisa_usuario = ref(null)

const usuarios_filtrados = computed(() => {
    const lista_usuarios = Object.values(usuarios.usuarios)
    if (pesquisa_usuario.value) {
        const regex = new RegExp(`.*${pesquisa_usuario.value}.*`, 'i')
        const filtrado = lista_usuarios.filter(elem => regex.test(elem.nome) || regex.test(elem.email))
        return filtrado
    } else {
        return lista_usuarios
    }

})

const novo_usuario = reactive({
    nome: "",
    email: "",
    role: "Usuário",
    ambientes: [],
    usuario_de: []
})

const novo_usuario_validate = reactive({
    nome: true,
    email: true,
    role: true
})

function reset_novo_usuario_validate() {
    novo_usuario_validate.nome = true
    novo_usuario_validate.email = true
    novo_usuario_validate.role = true
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
} 

function check_new_user() {
    if (novo_usuario.nome.length < 3) {
        novo_usuario_validate.nome = false 
    }
    if (!isValidEmail(novo_usuario.email)) {
        novo_usuario_validate.email = false 
    }
    if (novo_usuario.role == "") {
        novo_usuario_validate.role = false 
    }
    setTimeout(() => {
        reset_novo_usuario_validate()
    }, 2000)
    return novo_usuario_validate.nome && novo_usuario_validate.email && novo_usuario_validate.role
}

async function create_user() { 
    if(check_new_user()) {
        const novo_usuario_dados = toRaw(novo_usuario)
        console.log(novo_usuario_dados)
        const uptime = await usuarios.add_user(novo_usuario_dados)
        return true
    }
}

</script>
<template>
    <Modal modalid="userEditModal" :salve_callback="async () => await update_user(user_edit.email)">
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
                    @updaterole="(x) => update_role(user_edit.email, x)"></UserRole>
            </div>

            <div class="mb-3">
                <label for="ambientes" class="form-label">Líder dos seguintes ambientes</label>
                <UserAmbientes @remove="(x) => remove_lider_ambiente(user_edit.email, x)"
                    @add="(x) => add_lider_ambiente(user_edit.email, x)" :selected="user_edit.ambientes"
                    :all="lista_ambientes.todos" :unselectable="lista_ambientes.liderados"></UserAmbientes>
            </div>

            <div class="mb-3">
                <label for="ambientes" class="form-label">Usuário dos seguintes ambientes</label>
                <UserAmbientes @remove="(x) => remove_user_ambiente(user_edit.email, x)"
                    @add="(x) => add_user_ambiente(user_edit.email, x)" :selected="user_edit.usuario_de"
                    :all="lista_ambientes.todos" :unselectable="[]"></UserAmbientes>
            </div>
        </template>
    </Modal>
    <Modal modalid="userAddModal" :salve_callback="async () => await create_user()">
        <template #titulo>Criar usuário</template>
        <template #corpo>
            <div class="mb-3">
                <label for="nome" class="form-label">Nome</label>
                <input v-model="novo_usuario.nome" type="text" class="form-control" :class="{'border-danger': !novo_usuario_validate.nome}" id="nome">
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">e-mail</label> 
                <input v-model="novo_usuario.email" type="email" class="form-control" :class="{'border-danger': !novo_usuario_validate.email}" id="email">
            </div>

            <div class="mb-3">
                <label for="perfil" class="form-label">Perfil</label>
                <UserRole id="perfil" :role="novo_usuario.role" label="Perfil" :class="{'border-danger': !novo_usuario_validate.role}"
                    @updaterole="(x) => novo_usuario.role = x"></UserRole>
            </div>
        </template>
    </Modal>

    <button title="Adicionar usuário" class="btn btn-primary no-wrap" data-bs-target="#userAddModal"
        data-bs-toggle="modal"><i class="bi bi-plus"></i>Adicionar novo usuário</button>

    <table class="table">
        <thead>
            <tr>
                <th>Nome</th>
                <th>e-mail</th>
                <th>Perfil</th>
                <th class="w-25">Ambientes</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="5"><input v-model="pesquisa_usuario" placeholder="Digite para pesquisar"
                        class="form-control">
                </td>
            </tr>
            <tr v-for="(user, index) in usuarios_filtrados">
                <td> {{ user.nome }} </td>
                <td> <code>{{ user.email }}</code> </td>
                <td> {{ user.role }} </td>
                <td>
                    <span :title="'Líder do ambiente ' + x" class="badge text-bg-primary m-1"
                        v-for="x in user.ambientes">{{
                        x }}</span>
                    <span :title="'Usuário do ambiente ' + x" class="badge text-bg-secondary m-1"
                        v-for="x in user.usuario_de">{{ x }}</span>
                </td>
                <td> <button title="Editar usuário" class="btn btn-secondary no-wrap" data-bs-target="#userEditModal"
                        data-bs-toggle="modal" @click="() => selectmail = user.email"><i
                            class="bi bi-pencil"></i></button>
                </td>
            </tr>
        </tbody>
    </table>
</template>