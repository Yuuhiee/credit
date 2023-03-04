<template>
    <div class="logo">
        <img src="../assets/images/login-logo.png" />
    </div>
    <img class="bg-image" src="@/assets/images/login-bg-autumn.jpg" />
    <div class="text">
        <div class="block">
            <span class="big-text">404</span>
            <span>Not Found</span>
        </div>
        <div class="block" @click="router.back">
            <span id="go-back">返回上一级</span>
        </div>
    </div>
</template>

<script setup>
import router from "@/router";
// function toLogin() {
//     router.push("/");
// }
</script>

<style lang="scss" scoped>
.logo {
    text-align: start;
    // img {
    //     cursor: pointer;
    // }
}

.bg-image {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    backface-visibility: hidden;
    user-select: none;
    // filter: blur(3px) opacity(80%);
}

.text {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-weight: bold;
    text-shadow: 2px 5px 10px #0005;

    .block {
        background-color: rgba(255, 255, 255, 0.468);
        border-radius: 5px;
        padding: 10px 15px;
        margin-bottom: 10px;
    }

    .block:nth-child(2) {
        cursor: pointer;
    }

    .big-text {
        font-size: 34px;
        margin-right: 10px;
    }
}
</style>