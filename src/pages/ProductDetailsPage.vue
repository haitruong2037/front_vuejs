<template>
    <div class="px-6 lg:px-10 xl:px-40 min-h-[50vh] my-20 w-full">
        <div v-if="isLoading">
            <Loading />
        </div>
        <div v-else-if="!isLoading && Object.keys(data).length === 0"
            class="text-center flex items-center justify-center h-[50vh]">
            <h2 class="text-5xl font-bold">{{ errorMessage }}</h2>
        </div>
        <div v-else>
            <div class="lg:grid lg:grid-cols-2 gap-20 xl:gap-44">
                <div>
                    <div>
                        <img :src="showImage" alt="" class="w-full h-[500px] object-contain">
                    </div>
                    <div class="mt-2">
                        <div v-if="data?.product_images?.length > 5">
                            <swiper class="relative cursor-pointer" parallax grabCursor :slides-per-view="5"
                                @swiper="onSwiper" :navigation="{ nextEl: '.nextArrow', prevEl: '.prevArrow' }">
                                <div
                                    class="absolute top-2/4 left-0 right-0 m-auto flex justify-between h-0 z-50 text-2xl">
                                    <div class="prevArrow" @click="slidePrev">
                                        <font-awesome-icon icon="fa-solid fa-chevron-left" />
                                    </div>
                                    <div class="nextArrow" @click="slideNext">
                                        <font-awesome-icon icon="fa-solid fa-chevron-right" />
                                    </div>
                                </div>
                                <swiper-slide v-for="image in data.product_images" :key="image.id">
                                    <div>
                                        <img :src="image.url_image" @click="handleChangeImage(image.url_image)" alt=""
                                            class="w-24 h-24 object-contain"
                                            :class="{ 'opacity-50': showImage !== image.url_image }">
                                    </div>
                                </swiper-slide>
                            </swiper>
                        </div>
                        <div v-else class="flex justify-start gap-10">
                            <div v-for="image in data.product_images" :key="image.id">
                                <img :src="image.url_image" @click="handleChangeImage(image.url_image)" alt=""
                                    class="w-24 h-24 object-contain"
                                    :class="{ 'opacity-50': showImage !== image.url_image }">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-4 lg:gap-8 max-w-[536px]">
                    <h1 class="font-bold text-xl lg:text-3xl line-clamp-2 cursor-pointer" :title="data?.name">{{
                        data?.name
                    }}
                    </h1>
                    <div>
                        <span
                            class="border border-gray-300 p-2 rounded-md font-medium hover:border-gray-400 cursor-pointer">{{
                                data?.category?.name }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-xl lg:text-3xl">{{ calculateDiscountedPrice() }}</span>
                        <span class="font-medium lg:text-2xl text-gray-400"><s>{{ formatPrice(data.price) }}</s></span>
                    </div>
                    <div class="flex">
                        <div v-if="data?.hot">
                            <img src="/public/images/products/hot.png" alt="" class="w-24 h-24 object-cover">
                        </div>
                        <div v-if="data?.discount">
                            <img src="/public/images/products/sale_icon_153984.png" alt=""
                                class="w-24 h-24 object-cover">
                        </div>
                    </div>
                    <p v-if="data?.discount" class="font-bold text-2xl">Discount: {{ formatPrice(data?.discount) }}</p>
                    <p class="font-semibold text-2xl">View: {{ data?.view }}</p>
                    <div class="flex gap-4 lg:justify-between">
                        <button @click="handleWishlistAction"
                            class="border border-black w-44 h-12 px-2 lg:w-[260px] lg:h-14 rounded-md text-base font-medium">
                            {{ wishlistButtonText }}
                        </button>
                        <button @click="handleAddToCart(data.id)"
                            class="w-40 h-12 lg:w-[260px] lg:h-14 rounded-md text-base font-medium bg-black text-white">
                            Add to Cart
                        </button>
                    </div>
                    <div class="flex justify-between">
                        <div class="flex gap-2 items-center">
                            <div class="bg-[#F6F6F6] p-2 lg:p-4 rounded-xl">
                                <font-awesome-icon icon="fa-solid fa-car-side" />
                            </div>
                            <div>
                                <p class="text-[#717171] text-xs lg:text-sm">Free Delivery</p>
                                <p class="font-medium text-sm">1-2 day</p>
                            </div>
                        </div>
                        <div class="flex gap-2 items-center">
                            <div class="bg-[#F6F6F6] p-2 lg:p-4 rounded-xl">
                                <font-awesome-icon icon="fa-solid fa-house" />
                            </div>
                            <div>
                                <p class="text-[#717171] text-sm">In Stock</p>
                                <p class="font-medium text-sm">Today</p>
                            </div>
                        </div>
                        <div class="flex gap-2 items-center">
                            <div class="bg-[#F6F6F6] p-2 lg:p-4 rounded-xl">
                                <font-awesome-icon icon="fa-solid fa-circle-check" />
                            </div>
                            <div>
                                <p class="text-[#717171] text-sm">Guaranteed</p>
                                <p class="font-medium text-sm">1 year</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-20">
                <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
                    <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                            v-on:click="toggleTabs(1)"
                            v-bind:class="{ 'text-pink-600 bg-white': openTab !== 1, 'text-white bg-black': openTab === 1 }">
                            Description
                        </a>
                    </li>
                    <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                            v-on:click="toggleTabs(2)"
                            v-bind:class="{ 'text-pink-600 bg-white': openTab !== 2, 'text-white bg-black': openTab === 2 }">
                            Comments
                        </a>
                    </li>
                </ul>
                <div v-if="data?.description" v-bind:class="{ 'hidden': openTab !== 1, 'block': openTab === 1 }">
                    <div class="bg-[#FAFAFA] px-4 py-8">
                        <div class="product-detail" v-html="isReadMore ? data?.description : shortDescription"></div>
                        <button v-if="showReadMoreButton" @click="toggleReadMore"
                            class="text-blue-500 font-medium hover:underline mt-2">
                            {{ !isReadMore ? "Read More ..." : "Read Less" }}
                        </button>
                    </div>
                </div>
                <div v-bind:class="{ 'hidden': openTab !== 2, 'block': openTab === 2 }" class="mt-8 px-12">
                    <Comments />
                </div>
            </div>
        </div>
        <div v-if="relatedData?.length > 0" class="mt-24">
            <h1 class="text-2xl font-bold">Related Products</h1>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-6 lg:gap-x-10 mt-5">
                <CardProduct v-for="item in relatedData" :key="item.id" :productData="item" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axiosInstance from "../config/axiosInstance";
import { formatPrice } from '../utils/constant';
import Loading from '../components/Loading.vue';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import CardProduct from "../components/card/CardProduct.vue";
import Comments from "../components/Comments.vue";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'swiper/css';
import 'swiper/css/navigation';
import { debounce } from 'lodash';

const route = useRoute();
const store = useStore();
const data = ref({});
const showImage = ref('');
const isLoading = ref(false);
const swiperRef = ref(null);
const isReadMore = ref(false);
const errorMessage = ref('');
const isLogin = computed(() => store.getters['auth/isLogin']);
const relatedData = ref([])
const productId = ref(route.params.id);
const showReadMoreButton = ref(false);
const openTab = ref(1);

const wishlist = computed(() => store.getters["wishlist/wishlist"]);
const isProductInWishlist = computed(() => wishlist.value.some(item => item.product_id == productId.value));
const wishlistButtonText = computed(() => isProductInWishlist.value ? 'Remove Wishlist' : 'Add to Wishlist');

const handleProductDetails = async () => {
    isLoading.value = true
    try {
        const res = await axiosInstance.get(`/products/${productId.value}`)
        data.value = res;
        showImage.value = res.url_image
        showReadMoreButton.value = res.description.length > 2000;
    } catch (error) {
        errorMessage.value = "Product Not Found"
    } finally {
        isLoading.value = false
    }
};

const handleRelatedProduct = async () => {
    try {
        const res = await axiosInstance.get(`/products/${productId.value}/related`)
        relatedData.value = res
    } catch (error) {
        toast.error(error.message);
    }
};

const handleAddWishlist = async () => {
    if (!store.getters["auth/isLogin"]) {
        toast.error("Please login to add items to your wishlist");
        return;
    }
    try {
        const req = await axiosInstance.post("/wishlist/store", {
            product_id: data.value?.id
        })
        store.dispatch('wishlist/fetchWishlist');
        toast.success(req?.message)
    } catch (error) {
        toast.error(error?.message);
    }
};
const handleRemoveWishlist = async () => {
    try {
        const res = await axiosInstance.delete(`/wishlist/${productId.value}/destroy`)
        store.dispatch('wishlist/fetchWishlist');
        toast.success(res?.message);
    } catch (error) {
        toast.error(error?.message);
    }
}
const handleWishlistAction = () => {
    if (isProductInWishlist.value) {
        handleRemoveWishlist();
    } else {
        handleAddWishlist();
    }
}
const onSwiper = (swiper) => {
    swiperRef.value = swiper
};

const slideNext = () => {
    if (swiperRef.value) {
        swiperRef.value.slideNext()
    }
};

const slidePrev = () => {
    if (swiperRef.value) {
        swiperRef.value.slidePrev()
    }
};

const toggleTabs = (tabNumber) => {
    openTab.value = tabNumber;
};

const calculateDiscountedPrice = () => {
    const discountedPrice = data?.value?.price - data?.value?.discount;
    return formatPrice(discountedPrice);
};

const handleChangeImage = (url) => {
    showImage.value = url
}

const toggleReadMore = () => {
    isReadMore.value = !isReadMore.value;
};

const shortDescription = computed(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = data.value.description;
    const shortText = tempDiv.innerHTML.slice(0, 2000);
    tempDiv.innerHTML = shortText;
    return tempDiv.innerHTML;
});

const handleAddToCart = debounce(async (productId) => {

    if (isLogin.value) {
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
    } else {
        toast.error("Please log in to add products to cart!");
    }
}, 800);

watch(() => route.params.id, (newId) => {
    productId.value = newId;
    handleProductDetails();
    handleRelatedProduct();
});

onMounted(() => {
    handleProductDetails()
    handleRelatedProduct()
});
</script>

<style>
.product-detail p {
    font-size: 20px;
}

.product-detail h2 {
    font-size: 24px;
}
</style>
