<template>
    <div class="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
        <!-- overlay -->
        <div @click="handleCloseModal(false)" aria-hidden="true" class="fixed inset-0 w-full h-full bg-black/50 cursor-pointer">
        </div>
        <!-- Modal -->
        <div class="relative w-full cursor-pointer pointer-events-none transition my-auto mt-[8%] md:mt-[2%] p-5 md:p-10">
            <div
                class="w-full p-3 md:p-5 lg:p-10 bg-white cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-xl mx-auto min-h-[40vh] max-w-screen-xl">
                <div class="w-full grid grid-cols-2 gap-6">
                    <div class="order-detail col-span-2 md:col-span-1">
                        <span class="py-1 px-4 border-none rounded-2xl text-base md:text-lg font-medium items-center"
                        :class="[handlStatusOrder(order.status).color, handlStatusOrder(order.status).bg]"
                        > 
                            <font-awesome-icon icon="fa-solid fa-circle fa-xs" class="text-xs md:pb-0.5 mr-1" />
                            {{handlStatusOrder(order.status).text}}
                        </span>

                        <div class="mt-5 sm:mt-10 pb-2 sm:pb-5">
                            <div class="w-full">
                                <p class="text-gray-400 sm:font-semibold">Order Date</p>
                                <p class="text-sm sm:text-base">{{formatCreatedAt(order.created_at)}}</p>
                            </div>
                            <div class="w-full grid grid-cols-2 gap-4 lg:gap-10 mt-5">
                                <div class="col-span-1 border-r border-b-zinc-300">
                                    <p class="text-gray-400 sm:font-semibold">Receiver</p>
                                    <p class="text-sm sm:text-base mt-1">{{order?.order_address?.name}}</p>
                                </div>
                                <div class="col-span-1">
                                    <p class="text-gray-400	sm:font-semibold">Phone</p>
                                    <p class="text-sm sm:text-base mt-1">{{order?.order_address?.phone}}</p>
                                </div>
                            </div>
                             <div class="w-full grid grid-cols-2 gap-4 lg:gap-10 mt-5">
                                <div class="col-span-1 border-r border-b-zinc-300">
                                    <p class="text-gray-400 sm:font-semibold">Address</p>
                                    <p class="text-sm sm:text-base mt-1">{{order?.order_address?.address}}</p>
                                </div>
                                <div class="col-span-1">
                                    <p class="text-gray-400 sm:font-semibold">Note</p>
                                    <p class="text-sm sm:text-base mt-1">{{order.note}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-product col-span-2 md:col-span-1 order-first md:order-last flex flex-col gap-3">
                        <div v-if="order.order_details.length > 0" v-for="(item, index) in order.order_details" :key="item.id" class="flex justify-between border-b border-b-zinc-300 py-2 lg:p-4 sm:items-center gap-2"
                            :class="{ 'pb-0 border-b-0': index == order.order_details.length - 1 }">
                            <div class="product-info flex items-center gap-2 sm:gap-4">
                                <img :src="item.product?.url_image" alt="" class="w-12 h-12 sm:w-16 sm:h-16 object-contain">
                                <div class="text-sm sm:text-base">
                                    <router-link :to="{ name: 'product-detail', params: { id: item.product?.id } }">
                                        <p> {{ item.product?.name }} </p>
                                    </router-link>
                                    <p><span class="text-gray-400">Qty: </span> ({{ item.quantity }})</p>
                                </div>
                            </div>
                            <div class="price-info">
                                <div v-if="item.discount" class="text-center w-full">
                                    <p class="font-semibold text-sm sm:text-base leading-4 sm:leading-7 text-black">{{ formatPrice((item.price - item.discount) * item.quantity) }}</p>
                                    <p class="font-normal text-sm leading-7 text-gray-400	"><s>{{ formatPrice(item.price * item.quantity) }}</s></p>
                                </div>
                                <div v-else class="text-center w-full">
                                    <p class="font-semibold text-base leading-7 text-black">{{ formatPrice(item.price * item.quantity) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sm:mt-5 grid grid-cols-2 gap-5 pt-6 border-t border-zinc-300">
                    <div class="col-span-2 md:col-span-1 grid grid-cols-2 md:items-center">
                        <p class="col-span-1 font-semibold text-base md:text-xl">
                            Total Amount: <span class="text-red-500">{{ formatPrice(order.total) }}</span>
                        </p>
                        <p v-if="order.discount > 0" class="col-span-1 text-gray-400 font-semibold text-base md:text-xl">
                            Discount: <span class="text-black">{{ formatPrice(order.discount) }}</span>
                        </p>
                    </div>
                    <div class="col-span-2 md:col-span-1 place-self-end flex gap-3">
                        <button @click="handleCloseModal(false)" type="button"
                                class="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:focus:text-primary-400 dark:focus:border-primary-400 dark:focus:bg-gray-800">
                                <span class="flex items-center gap-1">
                                    <span class="">
                                        Cancel
                                    </span>
                                </span>
                            </button>
                        <button @click="handleCancelOrder()" type="button" class="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:ring-offset-red-700">
                            <span class="flex items-center gap-1">
                                <span class="">
                                    Cancel Order
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {defineEmits, defineProps, onMounted} from 'vue';
import {formatPrice, handlStatusOrder, formatCreatedAt} from '../../utils/constant'

const emit = defineEmits(['closeModal', 'cancelModal']);
const props = defineProps({
    order: {
        type: Object,
        required: true
    }
});

const order = props.order;

const handleCloseModal = () => {
    emit('closeModal')
};

const handleCancelOrder = () => {
    emit('cancelOrder')
};

</script>