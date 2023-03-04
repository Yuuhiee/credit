<template>
    <div class="login-page">
        <img class="bg-image" src="@/assets/images/login-bg-autumn.jpg" />
        <div class="container">
            <div class="logo">
                <img src="../assets/images/login-logo.png" alt="" />
            </div>
            <Login />
            <!-- <div class="footer">@CopyRight</div> -->
        </div>
    </div>
</template>

<script  setup>
import Login from "@/components/tools/Login.vue";
</script>

<style lang="scss" scoped>
.login-page {
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