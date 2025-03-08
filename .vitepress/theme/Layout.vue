<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import Banner from './components/Banner.vue';
import ServerInfo from './components/ServerInfo.vue';
import Feature from './components/feature.vue';



const base = useData().site.value.base
const route = useRoute()
const path = computed(() => route.path.replace(base, '').replace('index.html', ''))

</script>


<template>
    <template v-if="path === ''">
        <Banner class="banner" />
        <ServerInfo />
        <Feature />
    </template>
    <template v-else>
        <DefaultTheme.Layout />
    </template>
</template>


<style scoped>
.banner {
    height: 100vh;
}
</style>
