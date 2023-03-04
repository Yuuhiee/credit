<template>
    <div class="register">
        <div class="inner">
            <h2>用户注册</h2>
            <el-form label-position="left" label-width="50px" style="width: 280px">
                <el-form-item label="学 号">
                    <el-input v-model.number="username" />
                </el-form-item>
                <el-form-item label="姓 名">
                    <el-input v-model="name" />
                </el-form-item>
                <el-form-item label="密 码">
                    <el-input v-model="password" type="password" />
                </el-form-item>
            </el-form>
            <div class="error-msg">{{ errorMsg }}</div>
            <div class="register-button">
                <el-button type="primary" :loading="loading" @click="register">注册</el-button>
            </div>
            <el-link class="to-login" @click="router.push('/login')">去登录</el-link>
        </div>
    </div>
</template>

<script  setup>
import { ref } from "vue";
import { creditApi } from "@/request/index.js";
import { useRouter } from "vue-router";
import Toast from "@/utils/Toast";

const router = useRouter();

let username = ref("");
let name = ref("");
let password = ref("");

let loading = ref(false);
let errorMsg = ref("");

function checkForm() {
    if (username.value && password.value && name.value) {
        errorMsg.value = "";
        return true;
    }
    errorMsg.value = "请完善信息";
    return false;
}
function register() {
    if (!checkForm() || loading.value) return;
    loading.value = true;
    creditApi({
        url: "/user/register",
        method: "post",
        params: {
            username: username.value,
            name: name.value,
            password: password.value,
        },
    })
        .then((data) => {
            console.log(data);
            username.value = "";
            name.value = "";
            password.value = "";
            Toast("success", "注册成功，即将跳转登陆界面", 1000);
            setTimeout(() => {
                router.push("/login");
            }, 1000);
            loading.value = false;
        })
        .catch((error) => {
            console.log(error);
            if (/^timeout/.test(error.message)) errorMsg.value = "连接超时";
            else errorMsg.value = error.data.msg || "注册失败";
            loading.value = false;
        });
}
</script>
<style lang="scss" scoped>
.register {
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 8px;
    margin-bottom: 100px;
    padding: 20px 30px 10px 30px;

    .inner {
        display: inline-flex;
        gap: 6px;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h2 {
            font-weight: normal;
            font-size: 16px;
            margin-bottom: 22px;
        }

        .el-button {
            width: 100%;
        }

        .error-msg {
            width: 100%;
            text-align: start;
            color: red;
            font-size: 12px;
            transform: translateY(-12px);
        }

        .register-button {
            width: 100%;

            a {
                text-decoration: none;
            }
        }

        .el-link {
            font-size: 12px;
            margin-top: 5px;
            margin-bottom: 5px;
        }
    }
}
</style>
