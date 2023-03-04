<template>
    <div class="register-page">
        <img class="bg-image" src="@/assets/login-bg-autumn.jpg" />
        <div class="container">
            <div class="logo">
                <img src="../assets/login-logo.png" alt="" />
            </div>
            <Register />
        </div>
    </div>
</template>

<script setup>
import Register from "@/components/Register.vue";
</script>

<style lang="scss" scoped>
.register-page {
    width: 100%;
    height: 100%;

    .bg-image {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
        backface-visibility: hidden;
    }

    .container {
        width: 70%;
        margin: 0 auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 100px;

        .logo {
            width: 100%;
            text-align: start;
        }
    }

    .footer {
        position: absolute;
        width: 100%;
        left: 50%;
        transform: translateX(-50%);
        bottom: 80px;
        font-size: 12px;
        color: #fff;
    }
}
</style>