<template>
    <div class="font-[sans-serif] text-[#333]">
        <div class="min-h-screen flex flex-col items-center justify-center">
            <div
                class="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
                <div class="md:max-w-md w-full sm:px-6 py-4">
                    <router-view></router-view>
                </div>
                <div class="md:h-full max-md:mt-10 bg-[#000842] rounded-xl lg:p-12 p-8">
                    <img src="../../public/images/auth/signin-image.webp" class="w-full h-full object-contain"
                        alt="login-image" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup></script>