<template>
    <VeeForm @submit="onSubmit" :validation-schema="forgotPasswordRequestValidation">
        <div class="mb-8">
            <h3 class="text-3xl font-extrabold">Verify Email</h3>
            <p class="text-sm mt-4 ">Do have an account 
                <router-link to="/auth/login"
                    class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                    Login here
                </router-link>
            </p>
        </div>
        <div v-if="apiMessage.success" class="mt-4 w-full">
            <p  class="text-center text-lime-600 font-bold text-lg mb-2">
                {{ apiMessage.success }}
            </p>
            <router-link to="/auth/login"
                class="w-full flex gap-2 justify-center justify-items-center shadow-xl py-2.5 px-4 text-md font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Login here
            </router-link>
        </div>
        <div class="mt-4">
            <p class="text-red-500" v-if="apiMessage.error.message">{{ apiMessage.error.message }}</p>
        </div>
        <div class="mt-4">
            <p v-if="isLoading" class="w-full flex gap-2 justify-center justify-items-center shadow-xl py-2.5 px-4 text-md font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                We are verifying your email
                <span 
                    class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status">
                </span>
            </p>
            <p v-else></p>
        </div>
    </VeeForm>
</template>
<script setup>
import axiosInstance from '../../config/axiosInstance';
import { forgotPasswordRequestValidation } from '../../constants/validations/validations.js'
import { onMounted, ref } from "vue";
import { Form as VeeForm} from 'vee-validate';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLoading = ref( false );
const dataSubmit = ref({});
const apiMessage = ref( {
    error: {
        message: "",
        errors: [],
    },
    success: ""
} );

const onSubmit = async (data) => {
    try {
        apiMessage.value = {
            error: {
                message: "",
                errors: [],
            },
            success: ""
        };
        isLoading.value = true;

        const res = await axiosInstance.get( `/auth/verify-email/${data.id}/${data.hash}` )
        if ( res && res.message ) {
            apiMessage.value.success = res.message;
        }
    } catch ( err ) {
        apiMessage.value.error = err || { message: "Unknown error occurred" };
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    dataSubmit.value = {
        id: route.params.id,
        hash: route.params.hash
    };

    onSubmit(dataSubmit.value);
});

</script>
