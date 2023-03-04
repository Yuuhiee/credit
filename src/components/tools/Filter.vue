<script setup>
const props = defineProps({
    model: Object,
    options: {
        type: Object,
        default: []
    },
    clearable: {
        type: Boolean,
        default: false
    }
})
//清除筛选条件
function resetFilter() {
    for (let key in props.model) {
        props.model[key] = null
    }
}
</script>
  
<template>
    <div class="select-container filters">
        <el-select v-for="(item, key) of options" :key="key" v-model="model[key]" :placeholder="item.placeholder" clearable
            filterable>
            <el-option value="tip" :label="'请选择' + item.placeholder" disabled />
            <el-option v-for=" (option, index) in item.options" :key="index" :value="option.value" :label="option.label" />
        </el-select>
        <el-button v-if="clearable" @click="resetFilter" type="primary" plain>清空条件</el-button>
    </div>
</template>

<style lang="scss" scoped>
.select-container {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    margin-right: 10px;

    .el-select {
        width: 150px;
    }
}
</style>