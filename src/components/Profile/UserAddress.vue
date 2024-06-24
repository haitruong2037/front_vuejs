<template>
    <div class="w-full px-6 pb-8 md:mt-8 sm:max-w-4xl sm:rounded-lg">
        <div class="md-4 md:mb-8">
            <h2 class="text-2xl font-bold sm:text-xl">Delivery Addresses</h2>
            <p class="text-sm mt-4">This function is used to select the delivery address when placing an order</p>
        </div>
        
        <component :is="currentComponent" 
                    :currentAddressId="currentAddressId" 
                    :listAddresses="listAddresses" 
                    @changeCPN="handleChangeCPN" 
                    @submitForm="handleSubmit" 
                    @setDefaultAddress="handleSetDefaultAddress" 
                    @setEditAddress="handleSetEditAddress" 
                    @deleteAddress="handleDeleteAddress">
        </component>
    </div>
</template>

<script setup>
import ListAddress from './ListAddress.vue';
import NewAddress from './NewAddress.vue';
import UpdateAddress from './UpdateAddress.vue';
import { computed, ref, shallowRef } from 'vue';
import { useStore } from 'vuex';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const currentComponent = shallowRef(ListAddress);
const currentAddressId = ref(0);

const store = useStore();

const listAddresses = computed(() => store.getters['address/getAddresses']);

const handleChangeCPN = (newCPN) => {
    
    if (newCPN == 'NewAddress') {
        currentComponent.value = NewAddress
    }else if (newCPN == 'UpdateAddress') {
        currentComponent.value = UpdateAddress
    }else {
        currentComponent.value = ListAddress
    }
};

const handleSubmit = async (data) => {
    var action = "addAddress";
    if (data.id) {
        action = "updateAddress";
    }

    const response = await store.dispatch('address/'+action, data);

    if (response.success) {
        currentComponent.value = ListAddress;
        toast.success( response.message);
    }else{
        toast.error( response.message);
    }
};

const handleDeleteAddress = async (addressId) => {
    const response = await store.dispatch('address/removeAddress', addressId);

    if (response.success) {
        currentComponent.value = ListAddress;
        toast.success( response.message);
    }else{
        toast.error( response.message);
    }
};

const handleSetDefaultAddress = async (addressId) => {
    const response = await store.dispatch('address/setDefaultAddress', addressId);

    if (response.success) {
        currentComponent.value = ListAddress;
        toast.success( response.message);
    }else{
        toast.error( response.message);
    }
};

const handleSetEditAddress = (addressId) => {
    currentAddressId.value = addressId
};

</script>