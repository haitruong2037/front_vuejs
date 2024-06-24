<template>
    <Swiper class="relative cursor-pointer" parallax grabCursor @swiper="onSwiper" :breakpoints="{
        0: {
            slidesPerView: 4
        },
        768: {
            slidesPerView: 5
        }
    }" :navigation="{ nextEl: '.nextArrow', prevEl: '.prevArrow' }">
        <div class="absolute top-2/4 left-1 right-1 m-auto flex justify-between h-0 z-50 xl:text-2xl">
            <div class="prevArrow" @click="slidePrev">
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
            </div>
            <div class="nextArrow" @click="slideNext">
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
            </div>
        </div>
        <Swiper-slide v-for="category in dataCategories" :key="category.id">
            <router-link :to="{ name: 'product', query: { category: category.id } }">
                <div
                    class="flex flex-col items-center justify-center w-20 h-16 md:w-32 md:h-28 lg:w-44 lg:h-40 xl:w-64 xl:h-60 bg-[#EDEDED] rounded-md xl:rounded-xl text-center">
                    <img :src="category.url_image" alt="" class="w-16 h-10 lg:w-32 lg:h-24 object-contain">
                    <p class="text-xs line-clamp-1">{{ category.name }}</p>
                </div>
            </router-link>
        </Swiper-slide>
        <div class="swiper-pagination"></div>
    </Swiper>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axiosInstance from "../../config/axiosInstance"
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';

const swiperRef = ref(null);
const dataCategories = ref([]);

const handleGetCategories = async () => {
    try {
        const res = await axiosInstance.get('/categories');
        if (res.data.length > 0) {
            dataCategories.value = res.data;
        }
    } catch (error) {
        console.log(error);
    }
}

const onSwiper = (swiper) => {
    swiperRef.value = swiper;
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
onMounted(() => {
    handleGetCategories();
});
</script>

<style>
.swiper {
    padding-left: 20px;
}
</style>
