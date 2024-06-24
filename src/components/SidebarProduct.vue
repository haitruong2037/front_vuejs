<template>
    <div>
        <!-- Mobile dropdown for category selection -->
        <div class="block lg:hidden mb-3">
            <div class="flex justify-start gap-3">
                <div class="relative">
                    <button @click="toggleCategoryDropdown"
                        class="p-2 border border-black rounded-md bg-slate-50 dark:bg-slate-800">
                        Select Category
                    </button>
                    <div v-if="showCategories"
                        class="absolute top-full mt-2 w-full bg-white border border-black rounded-md z-10">
                        <div v-if="data.length > 0" class="p-2">
                            <div class="flex gap-x-3 py-2" v-for="category in data" :key="category.id">
                                <input type="checkbox" :value="category.id" v-model="selectedCategories">
                                <span class="font-medium text-base">{{ category.name }}</span>
                            </div>
                        </div>
                        <p v-else class="text-left text-lg font-medium mt-3 p-2">No Categories</p>
                    </div>
                </div>
                <div>
                    <select v-model="selectPrice"
                        class="appearance-none border border-black text-black outline-none p-2 w-full rounded-md bg-slate-50 dark:bg-slate-800">
                        <option value="0 - 0" selected>All Price</option>
                        <option value="0 - 5000000">Under 5 Millions</option>
                        <option value="5000000 - 10000000">5 - 10 Millions</option>
                        <option value="10000000 - 1000000000">Over 10 Millions</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- Desktop filters -->
        <div class="hidden lg:block mb-3">
            <h1 class="font-semibold lg:text-xl">Category</h1>
            <div v-if="isLoading"></div>
            <div v-else>
                <div v-if="data.length > 0" class="mt-3 max-h-72 overflow-y-auto custom-scrollbar">
                    <div class="flex gap-x-3 py-2" v-for="category in data" :key="category.id">
                        <input type="checkbox" :value="category.id" v-model="selectedCategories">
                        <span class="font-medium text-base">{{ category.name }}</span>
                    </div>
                </div>
                <p v-else class="text-left text-lg font-medium mt-3">No Categories</p>
            </div>
        </div>
        <div class="hidden lg:block">
            <h1 class="font-semibold text-xl">Price</h1>
            <div class="mt-3">
                <select v-model="selectPrice"
                    class="appearance-none border border-black text-black outline-none p-2 xl:w-40 rounded-md bg-slate-50 dark:bg-slate-800">
                    <option value="0 - 0" selected>All Price</option>
                    <option value="0 - 5000000">Under 5 Millions</option>
                    <option value="5000000 - 10000000">5 - 10 Millions</option>
                    <option value="10000000 - 1000000000">Over 10 Millions</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, defineEmits } from 'vue';
import axiosInstance from '../config/axiosInstance';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps({
    categoryId: String
});
const data = ref([]);
const selectedCategories = ref(props.categoryId ? [props.categoryId] : []);
const selectPrice = ref('0 - 0');
const isLoading = ref(false);
const showCategories = ref(false);
const emits = defineEmits(['changeCategories', 'changePrice']);

const handleGetCategories = async () => {
    isLoading.value = true;
    try {
        const res = await axiosInstance.get('/categories');
        if (res.data.length > 0) {
            data.value = res.data;
        }
    } catch (error) {
        toast.error(error);
    } finally {
        isLoading.value = false;
    }
};

const toggleCategoryDropdown = () => {
    showCategories.value = !showCategories.value;
};

watch(() => props.categoryId, (newCategoryId) => {
    selectedCategories.value = newCategoryId ? [newCategoryId] : [];
});

watch(selectedCategories, () => {
    emits('changeCategories', selectedCategories.value);
    showCategories.value = false;
});

watch(selectPrice, () => {
    emits('changePrice', selectPrice.value);
});

onMounted(() => {
    selectedCategories.value = props.categoryId ? [props.categoryId] : [];
    handleGetCategories();
});
</script>
