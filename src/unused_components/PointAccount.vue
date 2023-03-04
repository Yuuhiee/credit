
<!-- 
    没用
 -->





<template>
    <div class="point-account">
        <!-- <div class="total-points" v-if="props.isPersonal">
            <span>日常行为分：{{ dailyPoint }}分</span>
            <span>个性发展分：{{ personalityPoint }}分</span>
        </div> -->
        <!-- <PointTable class="point-table" /> -->
        <div class="point-table">
            <div class="select-container">
                <el-select
                    v-for="item of filter"
                    :key="item.placeholder"
                    v-model="item.value"
                    :placeholder="item.placeholder"
                    clearable
                >
                    <el-option
                        value="tip"
                        :label="'请选择' + item.placeholder"
                        disabled
                    />
                    <el-option
                        v-for="(option, index) in item.options"
                        :key="index"
                        :value="option.value"
                        :label="option.label"
                    />
                </el-select>
                <el-button type="primary" @click="requestTableData"
                    >筛选</el-button
                >
            </div>
            <el-table :data="pageData" stripe v-loading="loading">
                <el-table-column label="序号" width="140">
                    <template #default="scope">{{
                        (currentPage - 1) * pageSize + scope.$index + 1
                    }}</template>
                </el-table-column>
                <el-table-column
                    v-for="(header, index) in tableColumnHeaders"
                    :key="index"
                    :prop="header.prop"
                    :label="header.label"
                />
            </el-table>
            <div class="pagination-container">
                <el-pagination
                    v-model:current-page="currentPage"
                    small
                    background
                    layout="prev, pager, next"
                    :total="totalCount"
                />
                <div class="count-tip">
                    当前页有<span>{{ currentCount }}</span
                    >项，共<span>{{ totalCount }}</span
                    >项
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="PointAccount">
import { onMounted, ref, computed, reactive, getCurrentInstance } from "vue";
import { creditApi } from "@/request/index.js";
import { useStore } from "vuex";

const {
    appContext: {
        config: {
            globalProperties: { $scoreType: scoreType, $year },
        },
    },
} = getCurrentInstance();

let scoreTypeOptions = [];
scoreType.forEach((label, index) => {
    if (label) {
        scoreTypeOptions.push({
            label,
            value: index,
        });
    }
});

const store = useStore();

//获取当前用户名
const { username } = store.state;

//表格loading遮罩层的显示
let loading = ref(false);

let currentPage = ref(1);
let totalCount = computed(() => tableData.value.length);
let currentCount = computed(() => pageData.value.length);
const pageSize = 10;

//请求表格数据
function requestTableData() {
    if (loading.value) return;
    loading.value = true;
    console.log(filter.year.value || 0, filter.type.value || 0);
    creditApi({
        method: "post",
        url: "/user/allScore",
        params: {
            name: username,
            org: "无",
            year: filter.year.value || 0,
            type: filter.type.value || 0,
        },
    })
        .then((data) => {
            console.log(data);
            data.forEach((item) => {
                item.type = scoreType[item.type];
            });
            tableData.value = data;
            loading.value = false;
        })
        .catch((err) => {
            console.log(err);
            loading.value = false;
        });
}
//过滤器配置
let filter = reactive({
    year: {
        value: null,
        placeholder: "学年",
        options: $year.map((Y) => ({ label: Y, value: Y })),
    },
    type: {
        value: null,
        placeholder: "学分类型",
        options: scoreTypeOptions,
    },
});

//表头配置
const tableColumnHeaders = [
    { prop: "year", label: "学年" },
    // { prop: "date", label: "日期" },
    { prop: "organization", label: "加分部门" },
    { prop: "name", label: "活动名" },
    { prop: "type", label: "学分类别" },
    { prop: "score", label: "分数" },
    // { prop: "remark", label: "备注" },
];

//表格全部数据
let tableData = ref([]);
//对数据进行分页
let pageData = computed(() =>
    tableData.value.slice(
        (currentPage.value - 1) * pageSize,
        currentPage.value * pageSize
    )
);

// function filterHandler(){
//     // tableData.value=data.filter(
//     //         (data) => {
//     //         for (let key in filter)
//     //             if (filter[key].value !== '' && data[key] !== filter[key].value)
//     //                 return false
//     //             return true
//     //         }
//     // )
// }
onMounted(() => {
    requestTableData();
    // requestTotalPoints();
});
</script>

<style lang="scss" scoped>
.point-account {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    height: 100%;
}

.total-points {
    display: flex;

    span {
        font-size: 14px;
        color: #000;
        margin-right: 30px;
    }
}

.point-table {
    width: 100%;

    .select-container {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-bottom: 10px;
        margin-right: 10px;

        .el-select {
            width: 150px;
        }
    }

    .el-table {
        min-height: 440px;
    }

    .pagination-container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0 0 0;

        .count-tip {
            position: absolute;
            right: 20px;

            span {
                color: #409eff;
            }
        }
    }
}
</style>