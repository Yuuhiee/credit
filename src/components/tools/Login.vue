<template>
    <div class="login">
        <div class="inner">
            <h2>加分管理系统登录</h2>
            <el-form label-position="left" label-width="50px" style="max-width: 260px">
                <el-form-item label="学 号">
                    <el-input v-model="username" />
                </el-form-item>
                <el-form-item label="密 码">
                    <el-input v-model="password" @keypress.enter="login" type="password" />
                </el-form-item>
            </el-form>
            <div class="error-msg">{{ errorMsg }}</div>
            <div class="login-button">
                <el-button type="primary" :loading="loading" @click="login">{{ userType[0] }}登录</el-button>
            </div>
            <div class="link-container">
                <el-link class="change-role" :disabled="loading" @click="changeRole">{{ userType[1] }}登录</el-link>
                <!-- <el-link
                    class="to-register"
                    :disabled="loading"
                    @click="router.push('/register')"
                    >注册</el-link
                > -->
            </div>
        </div>
    </div>
</template>

<script  setup>
import { ref, computed, onMounted } from "vue";
import { creditApi } from "@/request/index.js";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/user";
const router = useRouter();
const store = useUserStore()
const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");
const asStudent = ref(true);
function changeRole() {
    asStudent.value = !asStudent.value;
}
let userType = computed(() => {
    if (asStudent.value) return ["用户", "管理员"];
    else return ["管理员", "用户"];
});

function checkForm() {
    if (username.value && password.value) {
        errorMsg.value = "";
        return true;
    }
    errorMsg.value = "请输入账号密码";
    return false;
}
function login() {
    if (!checkForm() || loading.value) return;
    loading.value = true;
    // if (asStudent.value) {
    //     router.addUserRoute();
    //     store.username.value=username.value;
    //     store.commit("setToken", "aaaaa");
    //     router.push("/student");
    //     console.log(111);
    // } else {
    //     router.addAdminRoute();
    //     store.username.value=username.value;
    //     store.commit("setToken", "aaaaa");
    //     router.push("/admin");
    // }
    creditApi({
        url: asStudent.value ? "/user/login" : "/user/adminLogin",
        method: "post",
        params: {
            username: username.value,
            password: password.value,
        },
    })
        .then((data) => {
            console.log(data);
            //登录成功
            if (asStudent.value) {
                router.addUserRoute();
                router.push("/student");
            } else {
                router.addAdminRoute();
                router.push("/admin");
            }
            store.username = username.value;
            store.token = data;
            loading.value = false;
        })
        .catch((error) => {
            console.log(error);
            if (/^timeout/.test(error.message)) errorMsg.value = "连接超时";
            else errorMsg.value = error.data.msg;
            loading.value = false;
        });
}

onMounted(() => {
    // handleDownload();
});
</script>
<style lang="scss" scoped>
.login {
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

        .login-button {
            width: 100%;

            a {
                text-decoration: none;
            }
        }

        .el-link {
            font-size: 12px;
            margin-top: 5px;
        }

        .link-container {
            // text-align: center;
            // position: relative;
            // margin: 5px 0;
            // .change-role {
            //     // position: absolute;
            //     // top: 0;
            //     // left: 50%;
            //     // transform: translateX(-50%);
            // }
            width: 100%;
            padding: 5px;
            display: flex;
            justify-content: center;
            // justify-content: space-between;
        }
    }
}
</style>
