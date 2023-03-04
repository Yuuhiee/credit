<template>
    <el-header>
        <div class="title">
            <div class="logo-container">
                <img src="@/assets/images/login-logo.png" alt="" />
            </div>
            <h1>{{ title }}</h1>
        </div>
        <div class="user">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <div class="username">
                        {{ store.username }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </div>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="exit">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/user";
const store = useUserStore();
const router = useRouter();

defineProps({
    title: String
})

function exit() {
    ElMessageBox.confirm("确认退出登录？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        icon: "QuestionFilled",
    })
        .then(() => {
            router.push("/");
            store.username = ""
            store.token = ""
            router.reset();
        })
        .catch(() => { });
}
</script>

<style lang="scss" scoped>
.el-header {
    // border: 1px solid #000;
    padding: 0;
    height: 60px;
    display: flex;
    justify-content: space-between;
    background-color: #eee;

    .title {
        display: flex;
        justify-content: center;
        align-items: center;

        .logo-container {
            height: 100%;
            display: inline-block;
            background-color: #474e55;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 220px;
            }
        }

        h1 {
            margin-left: 20px;
            font-size: 20px;
        }
    }
}

.user {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 50px;
    color: #333;
    position: absolute;
    right: 0;
    top: 20px;

    .username {
        cursor: pointer;
    }

    .el-dropdown {
        padding-top: 2px;
        padding-left: 3px;
    }
}
</style>