<template>
    <div class="order-page my-10 px-6 xl:px-40 lg:px-10 md:px-6">
        <h2 class="text-2xl font-bold">Order</h2>
        <div class="w-full grid grid-cols-12 gap-0 sm:gap-8 lg:gap-20 mt-5">
            <div class="details-container col-span-12 md:col-span-6">
                <div class="p-4 sm:p-6 rounded-2xl border border-neutral-200">
                    <h3 class="font-medium text-xl">Summary</h3>
                    <div class="mt-2 flex flex-col gap-3 border-b border-neutral-200 pb-5">
                        <div v-if="cartItems.length > 0" v-for="item in cartItems" :key="item.id" class="flex justify-between bg-zinc-100 rounded-lg p-2 sm:p-4 items-center gap-5">
                            <div class="product-info flex items-center gap-5">
                                <img :src="item.product?.url_image" alt="" class="w-16 h-16 object-contain">
                                <div>
                                    <p>{{ item.product?.name }} </p>
                                    <p class="font-black"><span class="font-medium text-gray-500">Qty: </span>({{ item.quantity }})</p>
                                </div>
                            </div>
                            <div class="price-info">
                                <div v-if="item.product?.discount" class="text-center w-full">
                                    <p class="font-semibold text-base leading-7 text-black">{{ formatPrice((item.product?.price - item.product?.discount) * item.quantity) }}</p>
                                    <p class="font-normal text-sm leading-7 text-gray-500"><s>{{ formatPrice(item.product?.price * item.quantity) }}</s></p>
                                </div>
                                <div v-else class="text-center w-full">
                                    <p class="font-semibold text-base leading-7 text-black">{{ formatPrice(item.product?.price * item.quantity) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <p class="font-normal text-zinc-500 mt-5 sm:mt-10">Address:</p>
                    <p class="mt-2">{{ selectedAddress?.address }}</p>
    
                    <p class="font-normal text-zinc-500 mt-3 sm:mt-4">Shipment method:</p>
                    <p class="mt-2">Free</p>
    
                    <div class="flex flex-row justify-between items-center mt-3 sm:mt-4">
                        <span class="text-base font-semibold">
                            Total Price Product
                        </span>
                        <span class="text-base font-semibold">
                            {{ formatPrice(cartTotal.totalPrice) }}
                        </span>
                    </div>
                    <div class="flex flex-row justify-between items-center mt-3 sm:mt-4">
                        <span class="text-base font-medium text-zinc-500">
                            Total Discount Product
                        </span>
                        <span class="text-base font-semibold">
                            {{ formatPrice(cartTotal.totalDiscount) }}
                        </span>
                    </div>
                    <div class="flex flex-row justify-between items-center mt-3 sm:mt-4">
                        <span class="text-base font-semibold">
                            Total
                        </span>
                        <span class="text-base font-semibold">
                            {{ formatPrice(cartTotal.totalFinal) }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="payment-container col-span-12 md:col-span-6 flex flex-col justify-between sm:mt-0 mt-5">
                <div>
                    <h3 class="font-medium text-xl">Options</h3>
                    <div class="mt-4">
                        <h4 class="font-bold">Choose the delivery addresses</h4>
    
                        <div class="address-list mt-2">
                            <div v-for="item in listAddresses" :key="item.id" class="flex flex-row items-center justify-between rounded-lg bg-zinc-100 p-3 sm:p-4 mt-4 transition-all ease-in-out">
                                <div class="address-info flex items-start gap-3">
                                    <input @click="handleSetAddress(item.id)" :checked="item.id == selectedAddress?.id" :id="'address_id_' + item.id" type="radio" class="h-4 w-4 mt-1 border-gray-300 focus:ring-2 focus:ring-blue-300">
                                    <label :for="'address-id-' + item.id" class="text-sm font-medium text-gray-900 ml-2 block">
                                        <span class="font-semibold text-base mr-2">{{ item.name }}</span>
                                        <span v-if="item.default" class="bg-black font-normal rounded-md p-1 px-2 uppercase text-xs text-white">Default</span>
                                        <p class="font-normal mt-2">
                                            {{ item.address }}
                                        </p>
                                        <p class="font-normal mt-2">
                                        {{ item.phone }}
                                        </p>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="mt-5 mx-auto">
                            <div class="w-full">
                                <label class="block font-bold mb-2">
                                    Your Message
                                </label>
                                <textarea v-model="noteMessage" rows="5" 
                                    class="appearance-none block w-full bg-zinc-100 text-gray-700 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-zinc-50 focus:border-gray-500 focus:border">
                                </textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 w-full grid grid-cols-2 gap-5">
                    <RouterLink :to="{ name: 'Carts' }" class="col-span-1 border border-black p-4 text-center rounded-md text-base  font-medium" >
                        Back
                    </RouterLink>
                    <button @click="handleShowModalConfirm" class="p-4 rounded-md text-base font-medium bg-black text-white text-center">
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Confirm -->
    <ModalConfirm v-if="showModalConfirm" @confirmModal="handleConfirmOrder" :content="modalContent"/>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { formatPrice } from '../utils/constant';
import ModalConfirm from '../components/ModalConfirm.vue';
import axiosInstance from "../config/axiosInstance";
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useStore();
const listAddresses = computed( () => store.getters['address/getAddresses'] );
const cartItems = computed( () => store.getters['cart/getCartItems'] );
const cartTotal = computed( () => store.getters['cart/getTotalCart'] );
const showModalConfirm = ref( false );
const noteMessage = ref(null);
const selectedAddress = ref( listAddresses.value.find( item => item.default == 1 ) );
const modalContent = {
    title: "Order Confirmation",
    content: "Confirm order to the selected address?",
}

watch( listAddresses, ( newListAddresses ) => {
    selectedAddress.value = newListAddresses.find( item => item.default == 1 );
} );

const handleShowModalConfirm = () => {
    if ( selectedAddress.value?.id != null || listAddresses.value.length >= 0 ) {
        showModalConfirm.value = !showModalConfirm.value;
    } else {
        toast.error( "Please select a address to delivery" );
    }
};

const handleSetAddress = ( id ) => {
    selectedAddress.value = listAddresses.value.find( item => item.id == id );;
}

const handleConfirmOrder = async ( confirm ) => {
    if ( confirm ) {
        const dataSubmit = {
            address_id: selectedAddress.value.id,
            note: noteMessage.value
        }
       
        try {
            const response = await axiosInstance.post( "/orders/store", dataSubmit );
            store.dispatch("cart/clearCart");
            toast.success( response.message ?? "Order created successfully" );

            setTimeout(() => {
                router.push({ name: 'order-history'});
            }, 2000)
        } catch ( error ) {
            toast.error( error.message );
        }

    } else {
        showModalConfirm.value = false;

    }
};

</script>