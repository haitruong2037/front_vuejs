<template>
    <div class="flex justify-between items-center px-6 py-4 xl:px-40 lg:px-10">
        <div>
            <router-link to="/">
                <h1 class="text-lg font-semibold hover:cursor-pointer lg:text-xl">Tech Store</h1>
            </router-link>
        </div>
        <div>
            <div class="w-44 h-8 relative lg:w-60 lg:h-10" id="outside">
                <div class="absolute top-1 px-3 lg:top-2">
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                </div>
                <input type="text" placeholder="Search" v-model="keyword" @keydown.enter="handleEnter"
                    @focus="showResults = true"
                    class="bg-[#f5f5f5] px-10 py-2 w-full h-full rounded-lg outline-none border-none">
                <div v-if="isLoading" class="bg-white text-gray-900 w-full mt-2 p-4 rounded-lg shadow-lg z-50">
                    <div
                        class="w-8 h-8  mx-auto rounded-full animate-spin border-4 border-solid border-indigo-500 border-t-transparent">
                    </div>
                </div>
                <div v-else-if="keyword.length > 0 && showResults"
                    class="absolute bg-white text-gray-900 w-full mt-2 p-4 rounded-lg shadow-lg z-50">
                    <div v-if="searchResults.length > 0">
                        <div v-for="result in searchResults" :key="result.id"
                            class="hover:bg-gray-100 rounded-md p-2 transition-colors">
                            <router-link :to="{ name: 'product-detail', params: { id: result.id } }"
                                class="flex items-center space-x-3">
                                <img :src="result.url_image" alt="Product Image"
                                    class="w-10 h-10 object-cover rounded-md">
                                <p class="line-clamp-2 font-medium">{{ result.name }}</p>
                            </router-link>
                        </div>
                    </div>
                    <div v-else>
                        <p class="text-gray-500">No results found.</p>
                    </div>
                </div>
            </div>
        </div>
        <nav class="hidden lg:flex">
            <ul class="flex lg:gap-5 xl:gap-x-[52px] hover:cursor-pointer">
                <li><router-link to="/">Home</router-link></li>
                <li @mouseenter="subMenuOpen = true" @mouseleave="subMenuOpen = false" class="relative">
                    <router-link :to="{ name: 'product' }">
                        Category <font-awesome-icon icon="fa-solid fa-chevron-down" />
                    </router-link>
                    <ul class="bg-[#FAFAFA] absolute w-64 min-w-64 max-h-64 overflow-y-auto text-lg rounded-md custom-scrollbar"
                        v-if="
                            subMenuOpen">
                        <li v-for="category in data" :key="category.id" class="py-2 pl-4">
                            <router-link :to="{ name: 'product', query: { category: category.id } }">
                                {{ category.name }}
                            </router-link>
                        </li>
                    </ul>
                </li>
                <li>Contact Us</li>
                <li>Blog</li>
            </ul>
        </nav>
        <div class="hidden lg:flex gap-x-6 hover:cursor-pointer text-xl items-center">
            <router-link :to="{ name: 'wishlist' }" class="relative">
                <font-awesome-icon icon="far fa-heart"/>
                <p v-if="countWishlist > 0"
                    class="absolute -top-2 -right-3 bg-red-500 px-2 rounded-full text-sm text-white">
                    {{ countWishlist }}
                </p>
            </router-link>
            <router-link :to="{name: 'Carts'}" class="relative">
                <font-awesome-icon icon="fa-solid fa-cart-shopping" />
                <p v-if="countCart > 0"
                    class="absolute -top-2 -right-4 bg-red-500 px-2 rounded-full text-sm text-white">
                    {{ countCart}}
                </p>
            </router-link>
            
            <UserDropdown v-if="isLoggedIn"/>
            <LoginDropdown v-else/>
        </div>
        <div class="lg:hidden">
            <div>
                <font-awesome-icon icon="fa-solid fa-bars" @click="sidebarOpen = true" />
            </div>
        </div>
        <div :class="{ 'translate-x-0': sidebarOpen, 'translate-x-full': !sidebarOpen }"
            class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden">
            <div class="flex justify-between items-center p-4">
                <h2 class="text-xl font-semibold">Menu</h2>
                <font-awesome-icon icon="fa-solid fa-times" @click="sidebarOpen = false" />
            </div>
            <div class="px-4">
                <ul class="flex flex-col gap-y-4 hover:cursor-pointer">
                    <li><router-link to="/">Home</router-link></li>
                    <li class="relative">
                        <router-link :to="{ name: 'product' }">Category </router-link>
                        <font-awesome-icon icon="fa-solid fa-chevron-down" @click="subMenuOpen = !subMenuOpen" />
                        <ul class="bg-[#FAFAFA] absolute w-64 min-w-64 text-lg rounded-md" v-if="subMenuOpen">
                            <li v-for="category in data" :key="category.id" class="py-2 pl-4">
                                <router-link :to="{ name: 'product', query: { category: category.id } }">
                                    {{ category.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <li>Contact Us</li>
                    <li>Blog</li>
                </ul>
                <div class="flex gap-x-6 mt-5 text-xl items-center flex-wrap">
                    <router-link :to="{ name: 'wishlist' }" class="relative">
                        <font-awesome-icon icon="far fa-heart" />
                        <p v-if="countWishlist > 0"
                            class="absolute -top-2 left-3 bg-red-500 px-2 rounded-full text-sm text-white">
                            {{ countWishlist }}
                        </p>
                    </router-link>
                    <router-link :to="{name: 'Carts'}" class="relative">
                        <font-awesome-icon class="text-xl" icon="fa-solid fa-cart-shopping" />
                        <p v-if="countCart > 0"
                            class="absolute -top-2 -right-4 bg-red-500 px-2 rounded-full text-sm text-white">
                            {{ countCart}}
                        </p>
                    </router-link>
                    
                    <UserDropdown v-if="isLoggedIn"/>
                    <LoginDropdown v-else/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import axiosInstance from "../config/axiosInstance";
import { useRouter } from 'vue-router';
import LoginDropdown from "./Header/LoginDropdown.vue";
import UserDropdown from "./Header/UserDropdown.vue";
import { computed } from "vue";
import { debounce } from "lodash"

const store = useStore();
const router = useRouter();
const countWishlist = ref([])
const data = ref([]);
const subMenuOpen = ref(false);
const keyword = ref('');
const searchResults = ref([]);
const showResults = ref(false);
const isLoading = ref(false);
const sidebarOpen = ref(false);

const isLoggedIn = computed(() => store.getters['auth/isLogin'] );
const countCart = computed(() => store.getters['cart/getCountCart'] );

watch(() => store.getters['wishlist/countWishlist'], (newValue) => {
    countWishlist.value = newValue;
});

const handleGetCategories = async () => {
    const res = await axiosInstance.get('/categories');
    if (res.data.length > 0) {
        data.value = res?.data;
    }
};

const handleSearchProduct = debounce(async () => {
    isLoading.value = true;
    try {
        const res = await axiosInstance.get('/products', {
            params: { search: keyword.value }
        });
        searchResults.value = res?.data;
    } catch (error) {
        
    } finally {
        isLoading.value = false;
    }
}, 300);

const handleEnter = () => {
    router.push({ name: 'product', query: { search: keyword.value } });
};

watch(keyword, () => {
    handleSearchProduct();
});

const handleClickOutside = (event) => {
    const headerElement = document.querySelector("#outside");
    if (headerElement && !headerElement.contains(event.target)) {
        showResults.value = false;
    }
};

onMounted(() => {
    handleGetCategories();
    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>
<style>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #888 #FAFAFA;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #FAFAFA;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
    border: 2px solid #FAFAFA;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}
</style>
