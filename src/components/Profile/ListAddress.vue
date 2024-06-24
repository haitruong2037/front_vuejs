<template>
    <div class="mt-4">
        <h4 class="font-bold">Select Address To Set Defaut</h4>

        <div class="address-list mt-2">
            <div v-for="item in listAddresses" :key="item.id" class="flex flex-row items-center justify-between rounded-lg bg-zinc-100 p-3 sm:p-6 mt-5 transition-all ease-in-out">
                <div class="address-info flex items-start gap-3">
                    <input @click.prevent="prepareSetDefault(item.id)" 
                            :checked="item.default == true" type="radio" 
                            class="h-4 w-4 mt-1 border-gray-300 focus:ring-2 focus:ring-blue-300">
                    <label :for="'address-id-'+item.id" class="text-sm font-medium text-gray-900 ml-2 block">
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
                <div class="address-action flex justify-end items-start gap-4 sm:gap-8">
                    <button>
                        <FontAwesomeIcon @click="handleSetEdit(item.id)" icon="fa-solid fa-pen" />
                    </button>
                    <button @click="handleSetDelelte(item.id)">
                        <FontAwesomeIcon icon="fa-solid fa-x" />
                    </button>
                </div>
            </div>

            <div class="border-t-2 border-gray-400 border-dotted mt-10 flex flex-col items-center justify-center">
                <button @click="handleRedirect('NewAddress')" class="rounded-[100%] bg-black w-8 h-8 text-white -mt-4">
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                </button>
                <p class="mt-1">Add New Address</p>
            </div>
        </div>
    </div>

    <ModalConfirm v-if="showModalConfirm" @confirmModal="handleConfirmModal" :content="modalContent"/>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {defineProps, defineEmits, ref } from 'vue';
import ModalConfirm from '../ModalConfirm.vue';

const showModalConfirm = ref( false );
const addressIdtoSetDefault = ref( null );

const modalContent = {
    title: "Set as default address",
    content: "Confirm selecting this address as the default address?"
}

const props = defineProps({
    currentAddressId: Number,
    listAddresses: Array
});

const emit = defineEmits(['changeCPN','deleteAddress', 'setDefaultAddress', 'setEditAddress', 'submitForm']);

const handleRedirect = (newCPN) => {
    emit('changeCPN', newCPN);
};

const handleSetDelelte = (addressId) => {
    emit('deleteAddress', addressId);
};

const prepareSetDefault = async (addressId) => {
    addressIdtoSetDefault.value = addressId;
    showModalConfirm.value = true;
};

const handleSetEdit = (addressId) => {
    emit('setEditAddress', addressId);
    handleRedirect('UpdateAddress');
};

const handleConfirmModal = async (confirm) => {
    if (confirm && addressIdtoSetDefault.value != null) {
           emit('setDefaultAddress', addressIdtoSetDefault.value);

    }
    addressIdtoSetDefault.value = null;
    showModalConfirm.value = false;
};

</script>