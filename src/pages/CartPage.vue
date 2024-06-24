<template>
    <div class="carts-page grid grid-cols-3 gap-5 lg:gap-10 mt-5 md:mt-10 md:my-16 my-10 px-6 xl:px-40 lg:px-10 md:px-6">
        <section class="cart-section col-span-3 md:col-span-2">
            <h2 class="font-bold text-xl leading-10 md:text-3xl">Shopping Carts</h2>
            <div class="flex flex-row items-center gap-4 mt-4 pd-6 pb-4 border-b border-gray-200">
                <div class="w-full md:max-w-[100px]">
                    <p class="font-normal text-lg leading-8 text-gray-600">Products</p>
                </div>
                <div class="grid grid-cols-12 w-full">
                    <div class="col-span-6"></div>
                    <div class="col-span-6 hidden md:block">
                        <div class="grid grid-cols-6 h-full place-items-center">
                            <div class="col-span-2">
                                <p class="font-normal text-lg leading-8 text-gray-600 text-center">Quantity</p>
                            </div>
                            <div class="col-span-3">
                                <div class="text-center w-full">
                                    <p class="font-normal text-lg leading-8 text-gray-600 text-center">Total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="cartItems.length > 0" v-for="item in cartItems" :key="item.product_id" 
                class="flex flex-row items-center gap-2 md:gap-4 min-h-24 mt-4 pd-6 pb-4 border-b border-gray-200">
                <div class="md:w-full max-w-[60px] md:max-w-[80px] xl:max-w-[100px]">
                    <img :src="item.product?.url_image" :alt="item.product?.image" class="mx-auto max-w-full h-18 md:h-20 object-contant">
                </div>
                <div class="grid grid-cols-12 w-full">
                    <div class="col-span-11 md:col-span-6 sm:col-span-12">
                        <div class="md:max-w-[250px]">
                            <RouterLink :to="{name: 'product-detail', params: {id: item.product_id}}" class="md:font-semibold text-base md:leading-6 text-black">{{ item.product?.name }}</RouterLink>
                            <RouterLink :to="{name: 'product', query: {category: item.product?.category?.id}}" class="hidden md:block font-normal text-base leading-7 text-gray-500">{{ item.product?.category?.name }}</RouterLink>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 sm:col-span-12 items-center mt-2 md:mt-0">
                        <div class="grid grid-cols-12 h-full md:place-items-center items-center">
                            <div class="col-span-4">
                                <div class="flex flex-row items-center">
                                    <div class="inline-flex items-center" role="group">
                                        <button
                                            @click="handleUpdateQuantity('deduct', item.id)"
                                            type="button"
                                            class="inline-block px-2 lg:px-4 lg:pb-[6px] lg:pt-2 text-lg font-medium">
                                            -
                                        </button>
                                        <span class="rounded-lg border-2 border-primary-100 px-2 lg:px-4 py-0 lg:py-1">{{ localQuantites[item.id] }}</span>
                                        <button
                                            @click="handleUpdateQuantity('plus', item.id)"
                                            type="button"
                                            class="inline-block px-2 lg:px-4 lg:pb-[6px] lg:pt-2 text-lg font-medium">
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-7">
                                <div v-if="item.product?.discount" class="text-end md:text-center w-full">
                                    <p class="font-semibold text-sm md:text-base md:leading-7 text-black">{{ formatPrice((item.product?.price - item.product?.discount) * item.quantity) }}</p>
                                    <p class="font-normal text-sm leading-7 text-gray-500"><s>{{ formatPrice(item.product?.price * item.quantity) }}</s></p>
                                </div>
                                <div v-else class="text-center w-full">
                                    <p class="font-semibold text-sm md:text-base leading-4 md:leading-7 text-black">{{ formatPrice(item.product?.price * item.quantity) }}</p>
                                </div>
                            </div>
                            <div class="col-span-1">
                                <button class="float-right" @click="handleRemoveQuantity(item.id)">
                                    <FontAwesomeIcon icon="fa-solid fa-x" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="h-24 mt-4 p-6 border-b border-gray-200">
                <h3 class="text-center">Cart is Empty</h3>
            </div>
        </section>
        <section class="total-section md:mt-8 col-span-3 md:col-span-1">
            <div class="p-4 lg:p-8 border border-gray-200 rounded-xl bg-gray-50">
                <h3 class="font-bold text-xl leading-10">
                    Order Summary
                </h3>
                <div class="flex flex-col gap-5 mt-5">
                    <div>
                        <p class="text-sm font-normal">
                            Discount code / Promo code
                        </p>
                        <input class="rounded-md border border-gray-300 w-full py-4 px-4 mt-2 text-black" type="text" placeholder="Code">
                    </div>
                    <div class="flex flex-row justify-between items-center">
                        <span class="text-base font-semibold">
                            Total Price Product
                        </span>
                        <span class="text-base font-semibold">
                            {{ formatPrice( cartTotal.totalPrice) }}
                        </span>
                    </div>
                    <div class="flex flex-row justify-between items-center">
                        <span class="text-base font-medium text-gray-400">
                            Total Discount Product
                        </span>
                        <span class="text-base font-semibold">
                            {{ formatPrice( cartTotal.totalDiscount) }}
                        </span>
                    </div>
                    <div class="flex flex-row justify-between items-center">
                        <span class="text-base font-semibold">
                            Total
                        </span>
                        <span class="text-base font-semibold">
                            {{ formatPrice( cartTotal.totalFinal) }}
                        </span>
                    </div>
                    <div class="mx-auto w-full">
                        <button @click="handleToOrder" class="w-full bg-black text-white px-4 py-4 rounded-lg block text-center">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, onMounted, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { formatPrice } from '../utils/constant';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { debounce } from 'lodash';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const cartItems = computed(() => store.getters['cart/getCartItems']);
const cartTotal = computed(() => store.getters['cart/getTotalCart']);
const localQuantites = ref([]);

onMounted(() => {
    cartItems.value.forEach(item => {
        localQuantites.value[item.id] = item.quantity;
    })
});

watch(cartItems, (newCartItems) => {
    newCartItems.forEach(item => {
        localQuantites.value[item.id] = item.quantity;
    })
} );

const debouncedUpdateQuantity = debounce( async (cartData) => {
    const response = await store.dispatch('cart/updateCart', cartData);

    if (response.success) {
        toast.success(response.message);
    } else {
        toast.error(response.message);
        localQuantites.value[cartData.id] = cartItems.value.find(item => item.id == cartData.id).quantity;
    }
}, 1000);

const handleUpdateQuantity = async (attr, cartID) => {
    if (localQuantites.value[cartID]) {
        if (attr === 'plus') {
            localQuantites.value[cartID] += 1;
        } else if (attr === 'deduct' && localQuantites.value[cartID] > 1) {
            localQuantites.value[cartID] -= 1;
        }
    }

    if (localQuantites.value[cartID] >= 1) {
        const cartData = {
            id: cartID,
            quantity: localQuantites.value[cartID]
        }
    
        debouncedUpdateQuantity(cartData);
    }
};

const handleRemoveQuantity = async (cartID) => {
    const response = await store.dispatch('cart/removeCart', cartID);

    if (response.success) {
        toast.success(response.message);
    } else {
        toast.error(response.message);
    }
};

const handleToOrder = () => {
    if (cartItems.value.length > 0) {
        router.push({name: "order",})
    } else { 
        toast.error('Please add products to cart before checkout!');
    }
};

</script>