<template>
    <div class="px-12 xl:px-40 lg:px-20 my-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div class="lg:col-span-2">
                <SidebarProduct @changeCategories="handleChangeCategories" @changePrice="handleChangePrice"
                    :categoryId="categoryId" />
            </div>
            <div v-if="isLoading" class="lg:col-span-10">
                <Loading />
            </div>
            <div v-else class="col-span-1 lg:col-span-10">
                <div v-if="data?.length > 0"
                    class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-y-6 gap-x-4 lg:gap-x-6">
                    <CardProduct v-for="item in data" :key="item.id" :productData="item" />
                </div>
                <p v-else class="text-center text-xl font-semibold">No Products</p>
                <div v-if="data.length > 0" class="bg-white col p-4 flex items-center flex-wrap justify-center mt-6">
                    <nav aria-label="Page navigation">
                        <ul class="inline-flex">
                            <li>
                                <button @click="handleChangePagination(params.page - 1)"
                                    class="h-10 px-5 text-black transition-colors duration-150 rounded-l-lg focus:shadow-outline">
                                    <font-awesome-icon icon="fa-solid fa-chevron-left" /></button>
                            </li>
                            <li v-for="pageNumber in totalPage" :key="pageNumber">
                                <button @click="handleChangePagination(pageNumber)" :class="[
                                    'h-10 px-5 text-black transition-colors duration-150 rounded-sm',
                                    'focus:shadow-outline',
                                    {
                                        'bg-black border border-r-0 text-white focus:shadow-outline hover:bg-black': params.page === pageNumber,
                                        '': params.page !== pageNumber
                                    }
                                ]">
                                    {{ pageNumber }}
                                </button>
                            </li>
                            <li>
                                <button @click="handleChangePagination(params.page + 1)"
                                    class="h-10 px-5 text-black transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline">
                                    <font-awesome-icon icon="fa-solid fa-chevron-right" /></button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import CardProduct from '../components/card/CardProduct.vue';
import SidebarProduct from '../components/SidebarProduct.vue';
import Loading from '../components/Loading.vue';
import { onMounted, ref, watch, watchEffect } from "vue";
import axiosInstance from "../config/axiosInstance";
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const route = useRoute();
const router = useRouter();
const searchKeyword = route.query.search;
const categoryId = ref(route.query.category);
const data = ref([]);
const isLoading = ref(false);

const params = ref({
    category: parseInt(categoryId) ? [parseInt(categoryId)] : [],
    min_price: 0,
    max_price: 0,
    search: searchKeyword,
    page: parseInt(route.query.page) || 1,
});
const totalPage = ref(0);

const handleGetProduct = async () => {
    isLoading.value = true;
    try {
        const queryParams = { ...params.value };
        if (!queryParams.search) {
            delete queryParams.search;
        }
        const res = await axiosInstance.get('/products', { params: queryParams });
        if (res?.data?.length > 0) {
            data.value = res?.data;
            totalPage.value = res?.last_page;
        } else {
            data.value = [];
        }
    } catch (error) {
        toast.error(error.message);
    } finally {
        isLoading.value = false;
    }
};

const handleChangePagination = (newPage) => {
    if (newPage > 0 && newPage <= totalPage.value) {
        params.value.page = newPage;
        router.push({ query: { ...route.query, page: params.value.page } });
    }
}

const handleChangeCategories = (newSelectedCategories) => {
    params.value.category = newSelectedCategories;
    handleGetProduct();
};

const handleChangePrice = (newSelectedPrice) => {
    const [minPrice, maxPrice] = newSelectedPrice.split(' - ').map(price => parseInt(price.trim()));
    params.value.min_price = minPrice;
    params.value.max_price = maxPrice;
}

watch(() => route.query.search, (newSearch) => {
    params.value.search = newSearch || '';
    handleGetProduct();
});

watch(() => route.query.category, (newCategory) => {
    categoryId.value = newCategory;
    params.value.category = [newCategory];
    handleGetProduct();
});

watchEffect(() => {
    handleGetProduct();
});

onMounted(() => {
    handleGetProduct();
});
</script>
