<template>
    <Header />
    <div class="min-h-[40vh]">
        <router-view></router-view>
    </div>
    <Footer />
</template>
<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>