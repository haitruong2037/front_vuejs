<template>
    <div class="mx-4 lg:mx-20 xl:mx-52 mt-16">
        <div class="">
            <h1 class="text-xl md:text-2xl font-bold mx-2">My Wishlist</h1>
        </div>
        <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                        <table class="min-w-full text-left text-sm font-light text-surface dark:text-white">
                            <thead class="border-b border-neutral-200 font-medium dark:border-white/10">
                                <tr>
                                    <th scope="col" class="hidden md:block md:px-4 lg:px-6 py-4"></th>
                                    <th scope="col" class="px-2 py-4">Image</th>
                                    <th scope="col" class="lg:px-6 py-4">Name</th>
                                    <th scope="col" class="px-2 py-4">Price</th>
                                    <th scope="col" class="py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody v-if="wishlist.length > 0">
                                <tr v-for="item in wishlist" :key="item.id"
                                    class="border-b border-neutral-200 dark:border-white/10">
                                    <td
                                        class="whitespace-nowrap hidden md:block font-medium text-base lg:text-xl cursor-pointer">
                                        <div @click="handleDeleteWishlistItem(item.product_id)">
                                            <font-awesome-icon icon="fa-solid fa-xmark" />
                                        </div>
                                    </td>
                                    <td class="whitespace-nowrap px-2 py-4">
                                        <img :src="item.product.url_image" alt=""
                                            class="max-w-16 max-h-16 md:max-w-24 md:max-h-24 lg:max-w-28 lg:max-h-28 object-contain">
                                    </td>
                                    <td
                                        class="line-clamp-2 text-start max-w-56 lg:max-w-full h-10 mt-6 md:mt-10 lg:px-6 text-sm md:text-lg md:h-14 font-semibold">
                                        <router-link :to="{ name: 'product-detail', params: { id: item.product.id } }">
                                            {{ item.product.name }}
                                        </router-link>
                                    </td>
                                    <td class="whitespace-nowrap px-2 py-4 text-sm font-normal">
                                        <p class="text-sm font-medium md:text-xl md:font-semibold">{{
                                            calculatePrice(item.product.price, item.product.discount) }}</p>
                                        <s v-if="item.product.discount"
                                            class="text-gray-400 text-sm font-medium md:text-lg md:font-semibold">{{
                                                formatPrice(item.product.price) }}</s>
                                    </td>
                                    <td class="whitespace-nowrap">
                                        <button @click="handleAddToCart(item.product.id)"
                                            class="bg-black text-white w-full h-14 rounded-lg font-medium text-base">
                                            Add to cart
                                        </button>
                                        <div class="md:hidden flex gap-2 ml-1">
                                            <font-awesome-icon icon="fa-solid fa-cart-shopping" />
                                            <font-awesome-icon icon="fa-solid fa-xmark" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr>
                                    <td colspan="5" class="text-center text-2xl font-bold py-4">
                                        There are no products in your favorites list.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import axiosInstance from '../config/axiosInstance';
import { useStore } from 'vuex';
import { formatPrice } from "../utils/constant";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { debounce } from 'lodash';

const store = useStore();
const wishlist = computed(() => store.getters["wishlist/wishlist"]);
const handleDeleteWishlistItem = async (product_id) => {
    try {
        const req = await axiosInstance.delete(`/wishlist/${product_id}/destroy`)
        store.dispatch('wishlist/fetchWishlist');
        toast.success(req.message)
    } catch (error) {
        toast.error(error.message)
    }
}

const handleAddToCart = debounce( async (productId) => {
    const cartData = {
        product_id: productId,
        quantity: 1,
    }

    const response = await store.dispatch('cart/addCart', cartData);

    if (response.success) {
        toast.success(response.message);
    } else {
        toast.error(response.message);
    }

}, 800);

const calculatePrice = (price, discount) => {
    const priceDiscount = price - discount;
    return formatPrice(priceDiscount);
};

</script>