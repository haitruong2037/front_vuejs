<template>
    <Form @submit="handleLogin" :validation-schema="schema">
        <div class="mb-6">
            <h3 class="text-3xl font-extrabold">Sign in</h3>
            <p class="text-sm mt-4 ">Don't have an account?
                <router-link to="/auth/register"
                    class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                    Register here
                </router-link>
            </p>
            <p v-if="errorsMessage" class="text-sm mt-4">You have not verified your email?
                <router-link to="/auth/verify-email-request"
                    class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                    Verify here
                </router-link>
            </p>
        </div>
        <div class="mb-3">
            <span v-if="errorsMessage" class="text-red-500 font-medium">{{ errorsMessage }}</span>
        </div>
        <div>
            <label class="text-xs block mb-2">Email</label>
            <div class="relative flex items-center">
                <Field name="email" type="text"
                    class="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                    placeholder="Enter email" />
                <font-awesome-icon icon="fa-solid fa-envelope" />
            </div>
            <ErrorMessage name="email" class="text-red-500" />
        </div>
        <div class="mt-8">
            <label class="text-xs block mb-2">Password</label>
            <div class="relative flex items-center">
                <Field name="password" :type="passwordFieldType"
                    class="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                    placeholder="Enter password" />
                <font-awesome-icon icon="fa-solid fa-eye" @click="handleTogglePassword" />
            </div>
            <ErrorMessage name="password" class="text-red-500" />
        </div>
        <div class="flex items-center justify-between gap-2 mt-5">
            <div class="flex items-center">
                <Field id="remember-me" name="remember-me" type="checkbox"
                    class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label for="remember-me" class="ml-3 block text-sm">
                    Remember me
                </label>
            </div>
            <div>
                <RouterLink :to="{name: 'ForgotPassword'}" class="text-blue-600 font-semibold text-sm hover:underline">
                    Forgot Password?
                </RouterLink>
            </div>
        </div>
        <div class="mt-12">
            <LoadingButton v-if="isLoading" />
            <button type="submit" v-else
                class="w-full shadow-xl py-2.5 px-4 text-base font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Sign in
            </button>
        </div>
    </Form>
</template>

<script setup>
import LoadingButton from '../../components/LoadingButton.vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import axiosInstance from '../../config/axiosInstance'
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
import { computed, ref } from 'vue';
const store = useStore()
const router = useRouter();
const errorsMessage = ref('');
const isLoading = ref(false);
const passwordVisible = ref(false);

const schema = yup.object({
    email: yup.string().email('Email must be a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
})
const handleLogin = async (values) => {
    try {
        isLoading.value = true;
        const res = await axiosInstance.post('/auth/login', {
            email: values.email,
            password: values.password
        })
        const data = {
            'user': res.user,
            'token': res.access_token
        }
        localStorage.setItem('token', res.access_token)
        store.dispatch('auth/loginUser', data)
        router.push('/')
    } catch (error) {
        errorsMessage.value = error.message
    } finally {
        isLoading.value = false
    }
}
const handleTogglePassword = () => {
    passwordVisible.value = !passwordVisible.value
}

const passwordFieldType = computed(() => {
    return passwordVisible.value ? 'text' : 'password';
});
</script>