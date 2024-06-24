<template>
    <div class="order-history-page mt-5 md:mt-10 my-10 px-6 xl:px-40 lg:px-10 md:px-6">
        <h2 class="text-2xl font-bold">History Orders</h2>

        <div v-if="isLoading" class="w-full">
            <Loading />
        </div>
        <div v-else class="w-full border border-zinc-200 rounded-lg p-2 md:p-5 mt-5">
            <div class="hidden w-full md:grid grid-cols-12 gap-5 border-b border-zinc-200 pb-4">
                <div class="col-span-2">
                    <p>Order date</p>
                </div>
                <div class="col-span-2">
                    <p>Receiver</p>
                </div>
                <div class="col-span-3">
                    <p>Address</p>
                </div>
                <div class="col-span-2">
                    <p>Total</p>
                </div>
                <div class="col-span-2">
                    <p>Status</p>
                </div>
                <div class="col-span-1">
                    <p>View</p>
                </div>
            </div>

            <div v-if="listOrders.length > 0" v-for="(order, index ) in listOrders" :key="order.id" class="w-full grid grid-cols-12 gap-2 md:gap-5 py-3 sm:py-6 border-b border-zinc-200 items-start md:items-center text-sm sm:text-base md:text-base"
                :class="{ 'pb-0 border-b-0': index === listOrders.length - 1 }">
                <div class="col-span-12 md:col-span-2 flex justify-between gap-2 md:block">
                    <p class="md:hidden text-gray-600">Created Date:</p>

                    <p class=" text-gray-600">{{formatCreatedAt(order.created_at)}}</p>
                </div>
                <div class="col-span-12 md:col-span-2 flex justify-between gap-2 md:block">
                    <p class="md:hidden">Receiver:</p>
                    <p>{{order?.order_address.name}}</p>
                </div>
                <div class="col-span-12 md:col-span-3 flex justify-between gap-2 md:block">
                    <p class="md:hidden">Address:</p>
                    <p>{{order?.order_address.address}}</p>
                </div>
                <div class="col-span-12 md:col-span-2 flex justify-between gap-2 md:block">
                    <p class="md:hidden">Total:</p>
                    <p class="font-semibold text-base md:text-lg">{{formatPrice(order.total)}}</p>
                </div>
                <div class="col-span-12 md:col-span-2 flex justify-between md:block">
                    <p class="md:hidden">Status:</p>
                    <span :class="[handlStatusOrder(order.status).color, handlStatusOrder(order.status).bg, 'p-1 px-3 rounded-3xl']">{{handlStatusOrder(order.status).text}}</span>
                </div>
                <div class="col-span-12 md:col-span-1">
                    <button @click="handleShowDetails(order.id)" class="p-2 px-1 sm:px-3 bg-gray-800 shadow shadow-zinc-200 rounded-lg text-white w-28 sm:w-auto">
                        <font-awesome-icon icon="fa-solid fa-eye" class="hidden md:inline" />
                        <span class="md:hidden">View Details</span>
                    </button>
                </div>
            </div>
            <div v-else>
                <p class="text-center mt-5 font-semibold text-xl">
                    You don't have any orders yet
                </p> 
            </div>
        </div>
        <div v-if="totalPages > 1" class="bg-white col p-4 flex items-center flex-wrap justify-center mt-6">
            <nav aria-label="Page navigation">
                <ul class="inline-flex">
                    <li>
                        <button @click="handleChangePagination(params.page - 1)"
                            class="h-10 px-5 text-black transition-colors duration-150 rounded-l-lg focus:shadow-outline hover:bg-gray-100">
                            <font-awesome-icon icon="fa-solid fa-chevron-left" /></button>
                    </li>
                    <li v-for="pageNumber in totalPages" :key="pageNumber">
                        <button @click="handleChangePagination(pageNumber)" :class="[
                            'h-10 px-5 text-white transition-colors duration-150 rounded-sm focus:shadow-outline',
                            { 
                                'bg-black border border-r-0 text-white focus:shadow-outline hover:bg-black': params.page === pageNumber,
                                'text-black hover:bg-gray-100': params.page !== pageNumber
                            }
                        ]">
                            {{ pageNumber }}
                        </button>

                    </li>
                    <li>
                        <button @click="handleChangePagination(params.page + 1)"
                            class="h-10 px-5 text-black transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-gray-100">
                            <font-awesome-icon icon="fa-solid fa-chevron-right" /></button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>

    <ModalDetails v-if="modalDetailsOpen" @close-modal="modalDetailsOpen = false"  @cancelOrder="handleCancelOrder" :order="selectedOrder"/>
    <ModalConfirm v-if="showModalConfirm" @confirmModal="handleConfirmCancel" :content="modalContent" :type="'danger'"/>
</template>
<script setup >
import { onMounted, ref, watch } from 'vue';
import axiosInstance from '../config/axiosInstance';
import {formatCreatedAt, formatPrice, handlStatusOrder} from '../utils/constant';
import Loading from '../components/Loading.vue';
import ModalDetails from '../components/Order/ModalDetails.vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import ModalConfirm from '../components/ModalConfirm.vue';

const router = useRouter();
const route = useRoute();
const listOrders = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);
const modalDetailsOpen = ref(false);
const showModalConfirm = ref(false);
const params = ref({
    page: parseInt(route.query.page) || 1,
});
const totalPages = ref(0);
const selectedOrder = ref({});
const modalContent = {
    title: "Cancel Order Confirmation",
    content: "Confirm cancel this order, youn cannot undo?",
}

const fetchData = async () => {
    try {
        isLoading.value = true;
        const response = await axiosInstance.get( "/orders/history", {params: params.value} );
        listOrders.value = response.data;
        totalPages.value = response.last_page
    } catch (error) {
        errorMessage.value = error.message ?? "Failed to fetch order history";
    } finally {
        isLoading.value = false;
    }
};

const handleShowDetails = (orderId) => {
    selectedOrder.value = listOrders.value.find(item => item.id == orderId);
    modalDetailsOpen.value = true;
}

const handleChangePagination = (newPage) => {
    if (newPage > 0 && newPage <= totalPages.value) {
        params.value.page = newPage;
        router.push({ query: { ...route.query, page: params.value.page } });
    }
}

const handleCancelOrder = async () => {
    if (selectedOrder.value.status == 'pending') {
        showModalConfirm.value = true;
    } else {
        toast.error( "You cannot cancel this order!" );
    }
}

const handleConfirmCancel = async (confirm) => {
    if (confirm) {
        dispatchCancel();
    }
    showModalConfirm.value = false;
}

const dispatchCancel = async () => {
    try {
        const data = {
            order_id: selectedOrder.value.id,
        }
        const response = await axiosInstance.post( "/orders/cancel", data );
        const canceledOrder = listOrders.value.find(item => item.id === selectedOrder.value.id);
        if (canceledOrder) {
            canceledOrder.status = "canceled";
        }
        toast.success(response.message ?? "Cancelled order");
    } catch (error) {
        toast.error(error.message ?? "Failure to cancel order");
        
    }
}

onMounted(() => {
    fetchData()
});

watch(params.value, (newParams) => {
    fetchData()
});
</script>