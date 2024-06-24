<template>
    <div v-if="isLoading">
        <Loading />
    </div>
    <div v-else>
        <div>
            <img src="/public/images/home/Banner.png" alt="" class="w-full object-cover">
        </div>
        <div class="px-6 xl:px-40 my-14">
            <h1 class="md:text-xl lg:text-2xl font-semibold mb-5">New Arrival</h1>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
                <CardProduct v-for="item in latestProduct" :key="item.id" :productData="item" />
            </div>
        </div>
        <div>
            <img src="/public/images/home/smallerbanner.png" alt="" class="w-full object-cover">
        </div>
        <div class="xl:px-36 my-20">
            <h1 class="lg:text-2xl font-semibold mb-3 pl-5">Browse By Category</h1>
            <div>
                <CardCategory />
            </div>
        </div>
        <div class="px-6 xl:px-40 mb-14">
            <div class="mb-14">
                <h1 class="md:text-xl lg:text-2xl font-semibold mb-3">Hot Product</h1>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
                    <CardProduct v-for="item in hotProduct" :key="item.id" :productData="item" />
                </div>
            </div>
            <div>
                <h1 class="md:text-xl lg:text-2xl font-semibold mb-3">Discount Product</h1>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
                    <CardProduct v-for="item in discountProduct" :key="item.id" :productData="item" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import CardCategory from '../components/card/CardCategory.vue';
import CardProduct from '../components/card/CardProduct.vue';
import axiosInstance from '../config/axiosInstance';
import Loading from '../components/Loading.vue'

const latestProduct = ref([]);
const hotProduct = ref([]);
const discountProduct = ref([]);
const isLoading = ref(false)

const handleGetProduct = async () => {
    isLoading.value = true;
    try {
        const res = await axiosInstance.get("/index");
        latestProduct.value = res.latestProducts
        hotProduct.value = res.hotProducts
        discountProduct.value = res.discountProducts
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
onMounted(() => {
    handleGetProduct()
})
</script>