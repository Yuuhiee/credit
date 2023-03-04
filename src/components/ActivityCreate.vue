<template>
    <div class="activity-create">
        <el-form label-width="100px" :model="activity" :rules="rules">
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="activity.name"></el-input>
            </el-form-item>
            <el-form-item label="活动地点" prop="site">
                <el-input v-model="activity.site"></el-input>
            </el-form-item>
            <el-form-item label="所属社团" prop="organization">
                <el-select v-model="activity.organization" placeholder="选择所负责的社团之一" filterable clearable>
                    <el-option v-for="item in organizations" :key="item.value" :value="item.value"
                        :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="学分类型" prop="type">
                <el-select placeholder=" " v-model="activity.type">
                    <el-option v-for="item in scoreType" :key="item.value" :value="item.value"
                        :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间" prop="time">
                <el-date-picker v-model="activity.time" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="活动年份" prop="year">
                <el-input-number v-model="activity.year" :min="2023" :max="2050" :step="1" controls-position="right"
                    step-strictly>
                </el-input-number>
            </el-form-item>
            <el-form-item label="所属学期" prop="tern">
                <el-select placeholder=" " v-model="activity.tern">
                    <el-option value="春季" label="春季"></el-option>
                    <el-option value="秋季" label="秋季"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动描述" prop="explanation">
                <el-input v-model="activity.explanation" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
                    resize="none">
                </el-input>
            </el-form-item>
            <el-button :loading="loading" type="primary" @click="createActivity">确认创建
            </el-button>
        </el-form>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { creditApi } from "../request";
import Toast from "../utils/Toast";
import useGlobalProperties from "../global/properties";

const { $scoreType } = useGlobalProperties()

const scoreType = [];
$scoreType.forEach((label, index) => {
    if (label) {
        scoreType.push({
            label,
            value: index,
        });
    }
});
//校验规则
const rules = {
    name: [
        {
            required: true,
            message: "",
            trigger: "blur",
        },
    ],
    explanation: [
        {
            required: false,
        },
    ],
    icon: [
        {
            required: false,
        },
    ],
    organization: [
        {
            required: true,
            message: "",
            trigger: "blur",
        },
    ],
    site: [
        {
            required: false,
        },
    ],
    time: [
        {
            required: false,
        },
    ],
    year: [
        {
            required: true,
            message: "",
            trigger: "blur",
        },
    ],
    tern: [{
        required: false,
        message: "",
        trigger: "blur",
    },],
    type: [
        {
            required: false,
        },
    ],
};

//校验表单
function checkForm() {
    let res = true
    for (const key in rules) {
        const { required } = rules[key][0]
        const value = activity[key]
        if (required && (/^\s*$/.test(value) || value === 0))
            res = false
        console.log(key, required);
    }
    return res
}
//记录表格数据
const activity = reactive({
    name: "",
    explanation: "",
    icon: "",
    organization: "",
    site: "",
    time: "",
    year: null,
    tern: '春季',
    type: 1,
});
//清空表格数据
function clearData() {
    activity.name = ""
    activity.explanation = ""
    activity.icon = ""
    activity.organization = ""
    activity.site = ""
    activity.time = ""
    activity.year = null
    activity.tern = '春季'
    activity.type = 1
}
//提交按钮-加载中-样式的控制
const loading = ref(false);

//提交表单,创建活动
function createActivity() {
    console.log(activity);
    if (loading.value) return;
    //表单未完善
    if (!checkForm())
        return Toast("warning", "请完善信息", 2000);
    loading.value = true;
    console.log(activity);
    //请求接口
    creditApi({
        url: "/activity/addactivity",
        method: "post",
        params: {
            ...activity,
            year: activity.year + activity.tern,
        }
    })
        .then((data) => {
            Toast("success", "创建成功", 2000);
            clearData();
        })
        .catch(() => {
        })
        .finally(() => {
            loading.value = false;
        })
}

//记录组织,用于渲染-组织select-中的options
let organizations = ref([]);
//获取社团数据
function getOrganizations() {
    creditApi({
        method: "post",
        url: "/user/admin",
    })
        .then((data) => {
            console.log(data);
            organizations.value = data.map(({ oname }) => {
                return {
                    value: oname,
                    label: oname,
                };
            });
        })
        .catch(() => { });
}

onMounted(() => {
    getOrganizations();
});
</script>

<style lang="scss" scoped>
.activity-create {
    height: 580px;
    padding: 40px 0 280px 0;

    .el-form {
        position: relative;
        width: 700px;

        .file-container {
            position: absolute;
            top: 120px;
            right: 0;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            --w: 120px;
            --h: 120px;

            .file-input {
                width: var(--w);
                height: var(--h);
                opacity: 0;
                margin-bottom: 20px;
                cursor: pointer;
            }

            .input-appearance {
                height: var(--h);
                width: var(--w);
                position: absolute;
                top: 0;
                display: inline-flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border: 1px dashed #ccc;
                border-radius: 3px;

                span {
                    color: #aaa;
                    font-size: 12px;
                    transform: translateY(20px);
                }
            }

            .tag-box {
                align-self: flex-start;
                height: 60px;
            }
        }
    }
}
</style>