<template>
    <div class="bg-white w-full flex flex-col gap-0 px-3 md:px-6 lg:px-10 xl:px-40 md:flex-row text-[#161931] md:gap-5">
        <aside class="py-4 md:w-1/3 lg:w-1/4 md:block">
            <div class="sticky flex flex-col gap-2 p-4 text-sm md:border-r md:border-indigo-100 top-12">
                <h2 class="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
                <p v-for="(item, index) in componentList" 
                    :key="index" 
                    @click="setCurrentComponent(item)"
                    :class="['flex', 'items-center', 'px-3', 'py-2.5', 'font-bold', 'border', 'rounded-full', 'md:w-full',
                            'hover:bg-gray-200', 'hover:text-indigo-800', 'cursor-pointer',
                        { 'bg-white': currentComponent === item.component, 'text-indigo-900': currentComponent === item.component }]">
                        {{ item.name }}
                </p>
            </div>
        </aside>
        <main class="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
            <div class="p-2 md:p-4">
                <component :is="currentComponent"></component>
            </div>
        </main>
    </div>
</template>
<script setup>
import 'vue3-toastify/dist/index.css';
import UpdateProfile from '../components/Profile/UpdateProfile.vue';
import UpdatePassword from '../components/Profile/UpdatePassword.vue';
import UserAddress from '../components/Profile/UserAddress.vue';
import { shallowRef } from 'vue';

const componentList = [
    { name: "Update Profile", component: UpdateProfile },
    { name: "Update Password", component: UpdatePassword },
    { name: "Delivery Addresses", component: UserAddress },
];

const currentComponent = shallowRef( UpdateProfile );

const setCurrentComponent = ( component ) => {
    currentComponent.value = component.component;
};

</script>