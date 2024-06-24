<template>
    <VeeForm @submit="onSubmit" :validation-schema="updateProfileValidation" class="w-full px-6 pb-8 mt-0 md:mt-8 sm:max-w-xl sm:rounded-lg" enctype="multipart/form-data">
        <h2 class="text-2xl font-bold sm:text-xl">Update Profile</h2>
        <div class="grid max-w-2xl mx-auto mt-8">
            <div class="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">

                <img class="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                    :src="selectedImage ?? defaulAvatar"
                    alt="Your avatar">

                <div class="flex flex-col space-y-5 sm:ml-8">
                    <label for="image" type="button"
                        class="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 ">
                        Change picture
                    </label>
                </div>
                <Field ref="fileInput" @change="handleFileChange" type="file" name="image" id="image" accept="image/*"
                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full p-2.5 hidden"
                />
                <ErrorMessage name="image" class="text-red-500 text-sm mt-1" />
            </div>

            <div class="items-center mt-8 sm:mt-14 text-[#202142]">

                <div class="mb-2 sm:mb-6">
                    <label for="name"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your
                        name</label>
                    <Field type="text" name="name" id="name" :value="user.name"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Your name"/>
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
                </div>

                <div class="mb-2 sm:mb-6">
                    <label for="email"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your
                        email</label>
                    <Field type="email" name="email" id="email" :value="user.email"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="your.email@mail.com"/>
                    <p v-if="error?.errors?.email" class="text-red-500 text-sm mt-1">{{ error.errors?.email }}</p>
                    <ErrorMessage v-else name="email" class="text-red-500 text-sm mt-1" />
                </div>

                <div class="mb-2 sm:mb-6">
                    <label for="address"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your
                        address</label>
                    <Field type="text" name="address" id="address" :value="user.address"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Your address"/>
                    <ErrorMessage name="address" class="text-red-500 text-sm mt-1" />
                </div>

                <div class="mb-2 sm:mb-6">
                    <label for="phone"
                        class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your
                        phone</label>
                    <Field type="text" name="phone" id="phone" :value="user.phone"
                        class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Your phone"/>
                    <p v-if="error?.errors?.phone" class="text-red-500 text-sm mt-1">{{ error.errors.phone }}</p>
                    <ErrorMessage v-else name="phone" class="text-red-500 text-sm mt-1" />
                </div>

                <div class="flex justify-end">
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
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate';
import { updateProfileValidation } from '../../constants/validations/validations'; 
import defaulAvatar from '../../assets/images/users/default-avatar.webp';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const store = useStore();
const user = ref( store.getters['auth/user'] );
const error = computed( () => {
    return store.getters['auth/error'];
} )

const selectedImage = ref( user.value?.url_image );
watch( user, ( newUser ) => {
    if ( newUser ) {
        selectedImage.value = newUser.url_image;
    }
}, { immediate: true } );

const fileInput = ref( null );

const handleFileChange = ( e ) => {
    const file = e.target.files[0];
    if ( file ) {
        const reader = new FileReader( file );
        reader.onload = ( e ) => {
            selectedImage.value = e.target.result;
            store.commit( 'auth/setImageURL', e.target.result );
        }
        reader.readAsDataURL( file );
    }
}

const onSubmit = async ( data ) => {
    const response = await store.dispatch( 'auth/updateUser', data );
    if ( response.success ) {
        const file = data.image;

        if ( file ) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageURL = reader.result;
                store.commit( 'auth/setImageURL', imageURL );
            };
            reader.readAsDataURL( file );
        }
        toast.success( response.message );
    } else {
        toast.error( response.message );
    }
};

</script>