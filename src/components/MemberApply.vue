<template>
    <div class="member-apply">
        <el-form label-width="100px" :model="responsibility" :rules="rules">
            <el-form-item label="社团" prop="organization">
                <el-select v-model="responsibility.organization" placeholder=" " style="width: 300px" filterable clearable>
                    <el-option v-for="(item, index) in organizations" :key="index" :value="item.value"
                        :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" :loading="loading" @click="applyForResponsibility">申请成为负责人</el-button>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { creditApi } from "@/request";
import Toast from "../utils/Toast";
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
const { username } = storeToRefs(useUserStore());


const rules = {
    organization: [
        {
            required: true,
            message: " ",
            trigger: "change",
        },
    ],
};

let responsibility = reactive({
    organization: "",
});
let organizations = ref([]);

const loading = ref(false);
function applyForResponsibility() {
    if (loading.value) return;
    if (!responsibility.organization)
        return Toast("warning", "请选择社团");
    loading.value = true;
    creditApi({
        method: "post",
        url: "/user/submitAdmin",
        params: {
            organization: responsibility.organization,
            username: username.value,
        },
    })
        .then((data) => {
            Toast("success", "已申请", 2000);
        })
        .catch(() => { })
        .finally(() => {
            loading.value = false;
        });
}
onMounted(() => {
    creditApi({
        method: "get",
        url: "/organization/organizationList",
    })
        .then((data) => {
            console.log(data);
            organizations.value = data.map((item) => {
                return {
                    value: item.organizationName,
                    label: item.organizationName,
                };
            });
        })
        .catch(() => { });
});
</script>

<style lang="scss" scoped>
.member-apply {
    height: 572px;
    padding: 10px 20px;
    box-sizing: border-box;
    margin-top: 20px;

    .el-form {
        width: 470px;

        .el-button {
            margin-top: 20px;
        }
    }

    .my-list {
        height: 20%;
    }
}

.table-container {
    min-height: 400px;
}

.el-link {
    font-size: 12px;
    margin-right: 8px;
}

.pagination-container {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0 0 0;
}
</style>