<template>
    <div class="bg-[#F6F6F6] flex flex-col gap-y-4 p-8 sm:p-6 rounded-lg">
        <div :class="{ 'flex justify-between': productData.hot === 1, 'flex justify-end': productData.hot !== 1 }">
            <span v-if="productData.hot === 1"
                class="bg-red-500 text-white text-xs sm:text-sm font-medium px-2 py-1 rounded-md">HOT</span>
            <div>
                <font-awesome-icon icon="fas fa-heart" v-if="wishlistContainsProduct" style="color: #ea1010;"
                    class="text-lg sm:text-xl cursor-pointer" @click="handleDeleteWishlistItem" />
                <font-awesome-icon icon="far fa-heart" v-else class="text-lg sm:text-xl cursor-pointer"
                    @click="handleAddWishlist" />
            </div>
        </div>
        <div>
            <img :src="productData.url_image" alt=""
                class="mx-auto w-28 sm:w-32 lg:w-40 h-28 sm:h-32 lg:h-40 object-cover">
        </div>
        <h3
            class="text-base sm:text-base lg:text-base font-medium w-full sm:w-full h-12 lg:h-12 text-center cursor-pointer line-clamp-2">
            {{ productData.name }}
        </h3>
        <div v-if="productData.discount" class="flex justify-center gap-2 items-center">
            <span class="text-center text-sm sm:text-lg xl:text-xl lg:text-base font-semibold mb-2">
                {{ calculateDiscountedPrice() }}
            </span>
            <span class="text-center text-gray-400 text-xs sm:text-sm lg:text-base font-medium mb-2">
                <s>{{ formatPrice(productData.price) }}</s>
            </span>
        </div>
        <div v-else class="text-center text-sm sm:text-base lg:text-base font-semibold mb-2">
            <span>{{ formatPrice(productData.price) }}</span>
        </div>
        <div class="mx-auto w-full">
            <router-link :to="{ name: 'product-detail', params: { id: props.productData.id } }">
                <button
                    class="bg-black text-white w-full h-14 text-base lg:text-base py-1.5 sm:py-2.5 lg:py-3 rounded-lg">
                    {{ message }}
                </button>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import axiosInstance from '../../config/axiosInstance';
import { formatPrice } from "../../utils/constant";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { debounce } from "lodash"
import { computed, ref, watch } from 'vue';

const store = useStore();
const wishlist = computed(() => store.getters["wishlist/wishlist"].map(item => item.product_id));

const props = defineProps({
    message: { type: String, default: 'Buy Now' },
    productData: {
        type: Object,
        default: () => ({})
    }
});
const handleAddWishlist = debounce(async () => {
    if (!store.getters["auth/isLogin"]) {
        toast.error("Please login to add items to your wishlist");
        return;
    }
    try {
        const req = await axiosInstance.post("/wishlist/store", {
            product_id: props.productData.id
        })
        store.dispatch('wishlist/fetchWishlist');
        toast.success(req?.message)
    } catch (error) {
        toast.error(error?.message);
    }
}, 500);
const handleDeleteWishlistItem = debounce(async () => {
    try {
        const req = await axiosInstance.delete(`/wishlist/${props.productData.id}/destroy`)
        store.dispatch('wishlist/fetchWishlist');
        toast.success(req.message)
    } catch (error) {
        toast.error(error.message)
    }
}, 500);
const calculateDiscountedPrice = () => {
    const { price, discount } = props.productData;
    const discountedPrice = price - discount;
    return formatPrice(discountedPrice);
};

const wishlistContainsProduct = computed(() => {
    return wishlist.value.includes(props.productData.id);
});
</script>
