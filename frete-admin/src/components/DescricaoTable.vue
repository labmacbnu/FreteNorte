<template>
<table class="table table-sm">
    <thead>
        <th>Código</th> 
        <th>Origem</th> 
    </thead>
    <tbody>
        <tr v-for="(item, index) in items" :key="'item-' + index">
            <td>{{ item.key }}</td> 
            <td>{{ item.origem }}</td> 
        </tr>
    </tbody>
</table>   
</template>
<script setup>
const props = defineProps(['items'])
</script>