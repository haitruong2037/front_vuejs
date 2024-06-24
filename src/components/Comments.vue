<template>
    <div>
        <div class="flex gap-10 mb-10 bg-gray-100 rounded-lg px-5 py-8">
            <div>
                <h1 class="font-semibold text-3xl">
                    {{ averageRating }}/5
                </h1>
                <div>
                    <div v-for="n in 5" :key="n" class="inline-block text-xl">
                        <font-awesome-icon :icon="['fa-solid', 'fa-star']" v-if="n <= averageRating"
                            style="color: #FFD43B;" />
                    </div>
                </div>
            </div>
            <div>
                <div class="flex gap-4">
                    <button @click="setRateFilter(null)" type="submit" class="border px-5 py-1 rounded-3xl bg-white"
                        :class="{
                            'bg-gray-200': params.rate == null
                        }">All</button>
                    <button v-for="n in 5" :key="n" @click="setRateFilter(n)" type="submit"
                        class="bg-white border px-5 py-1 rounded-3xl" :class="{
                            'bg-gray-200': params.rate == n
                        }">{{ n }}
                        <font-awesome-icon icon="fa-solid fa-star" style="color: #FFD43B;" class="text-lg" /></button>
                </div>
            </div>
        </div>
        <div v-if="dataComment.length > 0" class="border-b-2 p-4">
            <div v-for="comment in dataComment" :key="comment.id">
                <div class="flex items-center gap-4 mb-2">
                    <img :src="comment?.user?.url_image ?? DefaultImage" alt=""
                        class="w-10 h-10 rounded-full object-cover">
                    <p class="font-semibold text-base">{{ comment.user.name }}</p>
                    <span class="font-medium text-gray-400">{{ formatCreatedAt(comment.created_at) }}</span>
                </div>
                <div class="px-6 ml-10">
                    <div class="mb-2 flex items-center gap-2" v-if="comment.bought_product">
                        <font-awesome-icon icon="fa-solid fa-circle-check" style="color: #f80d0d;" />
                        <p class="text-red-500 font-normal text-sm">Bought at Techstore</p>
                    </div>
                    <div v-for="index in comment.rate" :key="index" class="inline-block mb-2">
                        <font-awesome-icon icon="fa-solid fa-star" style="color: #FFD43B;" class="text-sm" />
                    </div>
                </div>
                <div class="mb-4 ml-14 px-6 py-4 rounded-lg bg-gray-100">
                    <p>{{ comment.content }}</p>
                    <div class="flex justify-end items-center gap-2">
                        <p class="cursor-pointer" @click="handleOpenReply(comment.id)">Reply</p>
                        <font-awesome-icon icon="fa-solid fa-reply" />
                    </div>
                </div>
                <div v-if="comment.replies && comment.replies.length > 0">
                    <div class="ml-14 mb-3">
                        <p @click="handleOpenReplies(comment.id)" class="cursor-pointer text-sm text-gray-500">{{
                            openReplies[comment.id] ? 'Close' : 'Open' }}
                            Replies</p>
                    </div>
                    <div v-if="openReplies[comment.id]">
                        <div v-for="reply in comment.replies" :key="reply.id" class="ml-20 mb-3">
                            <div class="flex items-center gap-2 mb-2">
                                <img :src="reply?.user?.url_image ?? DefaultImage" alt=""
                                    class="w-8 h-8 rounded-full object-cover">
                                <p v-if="reply.admin_id">Admin</p>
                                <p v-else>{{ reply.user.name }}</p>
                                <span class="font-medium text-gray-400">{{ formatCreatedAt(reply.created_at) }}</span>
                            </div>
                            <div class="px-6 py-4 rounded-lg bg-gray-100 mt-3">
                                <p>{{ reply.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="selectedComment == comment.id && isLogin" class="my-5 ml-10">
                    <textarea id="message" rows="4" v-model="contentReply"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Reply this comment..."></textarea>
                    <div class="block text-end mt-2">
                        <button @click="handleReplyComment()"
                            class="bg-black text-white w-28 h-14 rounded-lg">Send</button>
                    </div>
                </div>
            </div>

            <div v-if="params.page < totalPage" class="text-center">
                <button @click="loadMore" class="bg-black text-white w-44 h-12 rounded-lg">Load more</button>
            </div>
        </div>
        <div v-else class="text-center">
            <p>This product has no comments yet</p>
        </div>
        <div class="mt-10" v-if="isLogin">
            <div class="flex items-center gap-3">
                <h1 class="font-bold text-xl">Rating:</h1>
                <div v-for="(star, index) in stars" :key="index" @mouseover="hoverStar(index)" @mouseleave="resetStars"
                    @click="selectStar(index)" class="inline-block cursor-pointer">
                    <font-awesome-icon :icon="[star.solid ? 'fas' : 'far', 'fa-star']" :style="{ color: '#FFD43B' }"
                        class="text-xl" />
                </div>
            </div>
            <div class="flex gap-2 mt-3">
                <img :src="user.url_image ?? DefaultImage" alt="" class="w-12 h-12 rounded-full object-cover">
                <div class="w-[98%]">
                    <textarea id="message" rows="4" v-model="content"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Add a comment..."></textarea>
                    <div class="block text-end mt-2">
                        <button @click="handleAddComment" class="bg-black text-white w-28 h-14 rounded-lg">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import DefaultImage from '../assets/images/users/default-avatar.webp';
import axiosInstance from "../config/axiosInstance";
import { formatCreatedAt } from "../utils/constant";

const store = useStore();
const route = useRoute();
const isLogin = computed(() => store.getters['auth/isLogin']);
const stars = ref([
    { solid: false, value: 1 },
    { solid: false, value: 2 },
    { solid: false, value: 3 },
    { solid: false, value: 4 },
    { solid: false, value: 5 },
]);
const selectedStarIndex = ref(-1);
const productId = ref(route.params.id);
const content = ref("");
const user = store.getters['auth/user'];
const dataComment = ref([]);
const averageRating = ref(0);
const selectedComment = ref("");
const contentReply = ref("");
const openReplies = ref([]);
const params = ref({
    page: 1,
    rate: null,
})
const totalPage = ref(0);

const handleGetComment = async (newRate = false) => {
    try {
        const res = await axiosInstance.get(`products/${productId.value}/comments`, { params: params.value });

        if (res) {
            const commentsData = res.comments.data;
            const averageRate = res.average_rate;
            const lastPage = res.comments.last_page;

            if (newRate) {
                dataComment.value = commentsData;
            } else {
                dataComment.value = [...dataComment.value, ...commentsData];
            }

            averageRating.value = averageRate;
            totalPage.value = lastPage;
        }
    } catch (error) {
        toast.error(error.message);
    }
};


const handleAddComment = async () => {
    if (content.value.trim() === "") {
        toast.error("Comment content cannot be empty.");
        return;
    }

    if (selectedStarIndex.value === -1) {
        toast.error("Please select a rating.");
        return;
    }

    try {
        const req = await axiosInstance.post(`products/${productId.value}/comments`, {
            rate: selectedStarIndex.value + 1,
            content: content.value,
            productId: productId.value
        });

        toast.success(req.message);
        content.value = "";
        selectedStarIndex.value = -1;

        resetStars();
        resetFilter();

    } catch (error) {
        toast.error(error.message);
    }
}

const handleReplyComment = async () => {
    try {
        const req = await axiosInstance.post(`products/${productId.value}/comments/${selectedComment.value}/reply`, {
            content: contentReply.value,
        });
        toast.success(req.message);

        const newReplyData = {
            id: Math.floor(Math.random() * 1000000000) + 1,
            user_id: user.id,
            user: {
                id: user.id,
                name: user.name,
                image: user.url_image,
                url_image: user.url_image
            },
            content: contentReply.value,
            created_at: new Date(),
        }

        const comment = dataComment.value.find(item => item.id === selectedComment.value);

        if (comment) {
            if (!Array.isArray(comment.replies)) {
                comment.replies = [];
            }
            comment.replies.push(newReplyData);
        }

        dataComment.value = [...dataComment.value];

        contentReply.value = "";
        selectedComment.value = "";

    } catch (error) {
        toast.error(error.message);
    }
}

const handleOpenReply = (commentId) => {
    if (selectedComment.value == commentId) {
        selectedComment.value = "";
    } else {
        selectedComment.value = commentId;
    }
    handleOpenReplies(commentId)
};

const hoverStar = (index) => {
    stars.value.forEach((star, i) => {
        star.solid = i <= index;
    });
};

const resetStars = () => {
    stars.value.forEach((star, i) => {
        star.solid = i <= selectedStarIndex.value;
    });
};

const selectStar = (index) => {
    selectedStarIndex.value = index;
    stars.value.forEach((star, i) => {
        star.solid = i <= index;
    });
};

const setRateFilter = (filter) => {
    params.value.rate = filter
    params.value.page = 1;
    handleGetComment(true);

};

const resetFilter = () => {
    params.value.rate = null;
    params.value.page = 1;

    handleGetComment(true);
}

const loadMore = () => {
    if (params.value.page < totalPage.value) {
        params.value.page += 1;
        handleGetComment();
    }
}

const handleOpenReplies = (commentId) => {
    if (!openReplies.value[commentId]) {
        openReplies.value[commentId] = true;
    } else {
        openReplies.value[commentId] = !openReplies.value[commentId]
    }
}

onMounted(() => {
    handleGetComment()
});
</script>