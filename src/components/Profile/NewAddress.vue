<template>
    <VeeForm @submit="onSubmit" :validation-schema="addressValidation">
        <div class="grid max-w-2xl mt-4">
            <h3 class="font-semibold">Add New Address</h3>
            <div class="items-center mt-2 sm:mt-6 text-[#202142]">
                <div class="mb-2 sm:mb-6">
                    <label for="name"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                        Name
                    </label>
                    <Field type="text" name="name" id="name"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Your Current Password"/>
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
                </div>
    
                <div class="mb-2 sm:mb-6">
                    <label for="phone"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                        Phone
                    </label>
                    <Field type="text" name="phone" id="phone"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Phone"/>
                    <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
                </div>
    
                <div class="mb-2 sm:mb-6">
                    <label for="address"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                        Address
                    </label>
                    <Field type="text" name="address" id="address"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Address"/>
                    <ErrorMessage name="address" class="text-red-500 text-sm mt-1" />
                </div>

                <div class="mb-2 sm:mb-6">
                    <label for="default"
                        class="mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                        Default
                    </label>
                    <Field type="checkbox" name="default" id="default" :value="1"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm ml-2"/>
                    <ErrorMessage name="default" class="text-red-500 text-sm mt-1" />
                </div>
    
                <div class="flex justify-between gap-5">
                    <button @click="handleRedirect('ListAddress')"
                        class="text-white bg-zinc-300  hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                        Back
                    </button>
                    <button type="submit"
                        class="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </VeeForm>
</template>

<script setup>
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate';
import { addressValidation } from '../../constants/validations/validations';
import { ref } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['changeCPN', 'submitForm']);
const handleRedirect = (newCPN) => {
    emit('changeCPN', newCPN);
};
const isLoading = ref(false);

const onSubmit = ( data ) => {
    emit('submitForm', data);

};
</script>