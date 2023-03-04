<!-- 首页左侧的菜单 -->
<script setup>
defineProps({
    defaultActive: String,
    menu: Array,
})
const emit = defineEmits(['active-change'])
</script>
  
<template>
    <el-menu background-color="#545c64" :default-active="defaultActive" class="el-menu-vertical-demo" text-color="#fff"
        router>
        <template v-for="(item, index) in menu" :key="index">
            <el-menu-item v-if="item.type == 'MenuItem'" :key="index" :index="String(index)"
                @click="emit('active-change', item.title)" :route="item.router">
                <el-icon>
                    <Component :is="item.icon" />
                </el-icon>
                <span>{{ item.title }}</span>
            </el-menu-item>
            <el-sub-menu v-else-if="item.type == 'SubMenu'" :index="String(index)">
                <template #title>
                    <el-icon>
                        <Component :is="item.icon" />
                    </el-icon>{{ item.title }}
                </template>
                <el-menu-item v-for="(subItem, subIndex) in item.items" :key="subIndex" :index="`${index}-${subIndex}`"
                    @click="emit('active-change', subItem.title)" :route="subItem.router">
                    <span>{{ subItem.title }}</span>
                </el-menu-item>
            </el-sub-menu>
        </template>
    </el-menu>
</template>