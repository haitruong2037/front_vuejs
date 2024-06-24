<template>
    <VeeForm @submit="onSubmit" :validation-schema="resetPasswordValidation">
        <div class="mb-8">
            <h3 class="text-3xl font-extrabold">Reset Password</h3>
            <p class="text-sm mt-4 ">Do have an account 
                <router-link to="/auth/login"
                    class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                    Login here
                </router-link>
            </p>
        </div>
        <p v-if="apiMessage.success" class="text-center text-lime-600 font-bold text-lg mb-2">{{ apiMessage.success }}</p>
        <p v-if="apiMessage?.error?.message" class="text-center text-red-600 font-bold text-lg mb-2">{{ apiMessage?.error?.message }}</p>
        <div class="mt-4">
            <Field type="hidden" name="token" v-model="token"/>
            <Field type="hidden" name="email" v-model="email"/>
            <label class="text-xs block mb-2">Password</label>
            <div class="relative flex items-center">
                <Field name="password" type="password"
                    class="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                    placeholder="Enter password" />
            </div>
            <ErrorMessage name="password" class="text-red-500" />
        </div>
        <div class="mt-4">
            <label class="text-xs block mb-2">Confirm Password</label>
            <div class="relative flex items-center">
                <Field name="password_confirmation" type="password"
                    class="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                    placeholder="Enter Confirm password" />
            </div>
            <ErrorMessage name="password_confirmation" class="text-red-500" />
        </div>
        <div class="mt-12">
            <button 
                class="w-full flex gap-2 justify-center justify-items-center shadow-xl py-2.5 px-4 text-md font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Send
                <span v-if="isLoading" 
                    class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status">
                </span>
            </button>
        </div>
    </VeeForm>
</template>
<script setup>
import axiosInstance from '../../config/axiosInstance';
import { resetPasswordValidation } from '../../constants/validations/validations.js'
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate';

const isLoading = ref( false );
const route = useRoute();
const token = ref('');
const email = ref('');
const apiMessage = ref( {
    error: {
        message: "",
        errors: [],
    },
    success: ""
} );

const onSubmit = async ( data, { resetForm } ) => {
    try {
        apiMessage.value = {
            error: {
                message: "",
                errors: [],
            },
            success: ""
        };
        isLoading.value = true;

        const res = await axiosInstance.post( '/auth/reset-password', data )
        if ( res && res.message ) {
            apiMessage.value.success = res.message;
            resetForm();
        }
    } catch ( err ) {
        apiMessage.value.error = err || { message: "Unknown error occurred" };
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    token.value = route.params.token;
    email.value = route.params.email;
});

</script>
