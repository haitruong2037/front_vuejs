<template>
    <VeeForm @submit="onSubmit" :validation-schema="passwordValidation" class="w-full px-6 pb-8 mt-0 md:mt-8 sm:max-w-xl sm:rounded-lg" enctype="multipart/form-data">
        <h2 class="text-2xl font-bold sm:text-xl">Update Password</h2>
        <div class="grid max-w-2xl mx-auto mt-1">
            <div class="items-center mt-2 sm:mt-6 text-[#202142]">
                <div class="mb-2 sm:mb-6">
                    <label for="name"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                        Current Password
                    </label>
                    <Field type="password" name="old_password" id="old_password"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Your Current Password"/>
                    <ErrorMessage name="old_password" class="text-red-500 text-sm mt-1" />
                </div>

                <div class="mb-2 sm:mb-6">
                    <label for="new_password"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                        New Password
                    </label>
                    <Field type="password" name="new_password" id="new_password"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="New Password"/>
                    <ErrorMessage name="new_password" class="text-red-500 text-sm mt-1" />
                </div>

                <div class="mb-2 sm:mb-6">
                    <label for="new_password_confirmation"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                        Confirm New Password
                    </label>
                    <Field type="password" name="new_password_confirmation" id="new_password_confirmation"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Confirm New Password"/>
                    <ErrorMessage name="new_password_confirmation" class="text-red-500 text-sm mt-1" />
                </div>

                <div class="flex justify-end ">
                    <button type="submit"
                        class="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm mt-2 md:mt-0 w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </VeeForm>
</template>

<script setup>
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate';
import { passwordValidation } from '../../constants/validations/validations';
import axiosInstance from '../../config/axiosInstance';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { ref } from 'vue';
const isLoading = ref(false);

const onSubmit = async( data, { resetForm} ) => {
    try {
        isLoading.value = true;
        const response = await axiosInstance.post( "/auth/change-pass", data );
        resetForm();
        toast.success( response.message ?? "Updated Password Successfully" );
    } catch (error) {
        toast.error( error.message ?? "Update password error!" );
    } finally {
        isLoading.value = false;
    }
};

</script>