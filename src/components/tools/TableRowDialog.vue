<script setup>
import { ref, computed, watch } from 'vue';
const props = defineProps({
    title: String,
    modelValue: Boolean,
    keys: Array,
    data: Object
})
const emit = defineEmits(['update:modelValue', 'confirm'])
const visible = computed(() => props.modelValue)
const changeVisible = (val) => { emit('update:modelValue', val) }

const rules = {};
props.keys.forEach((key) => {
    if (key.type === String)
        rules[key.prop] = [{
            required: key.require,
            message: " ",
            trigger: "blur",
            validator: (rules, value, callback) => {
                if (/^\s*$/.test(value)) callback(new Error());
            }
        }]
    else if (key.type === Number)
        rules[key.prop] = [{
            required: key.require,
            trigger: "change",
            validator: (rules, value, callback) => {
                if (value == 0) callback(new Error());
            }
        }]
})

let data = ref();
const getData = () => {
    const temp = props.data != undefined ? { ...props.data } : {}
    if (props.data == undefined)
        props.keys.forEach(key => {
            if (key.type === String) temp[key.prop] = ""
            if (key.type === Number) temp[key.prop] = 0
        })
    data.value = temp
}
watch([props, visible], () => {
    getData()
}, { immediate: true })
const checkData = () => {
    let res = true
    props.keys.forEach(({ require, prop }) => {
        const value = data.value[prop]
        if (require && (/^\s*$/.test(value) || value === 0))
            res = false
    })
    return res
}
const returnData = () => {
    emit('confirm', data.value)
    changeVisible(false)
}

</script>
  
<template>
    <el-dialog :modelValue="visible" @update:modelValue="changeVisible($event)" :title="title">
        <el-form label-width="100px" :model="data" :rules="rules">
            <el-form-item v-for="(key, index) in props.keys" :key="index" :label="key.label" :prop="key.prop"
                style="width: 80%">
                <el-input v-if="key.type === String && !key.textarea" v-model="data[key.prop]"></el-input>
                <el-input v-if="key.type === String && key.textarea" v-model="data[key.prop]" type="textarea" :rows="2"
                    maxlength="30" show-word-limit resize="none">
                </el-input>
                <el-input-number v-if="key.type === Number" v-model="data[key.prop]" :precision="1" :step="0.5" :min="0" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="changeVisible(false)">取消</el-button>
                <el-button :disabled="!checkData()" type="primary" @click="returnData">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
