<template>
    <div class="index-page">
        <PageHeader title="加分管理系统-管理员界面" />
        <el-container>
            <el-aside>
                <MenuList :default-active="defaultActive" :menu="menu" @active-change="currentView = $event" />
            </el-aside>
            <el-main>
                <div class="view-container">
                    <div class="current-view" v-if="currentView">
                        <el-icon>
                            <ArrowRight />
                        </el-icon>
                        <span>{{ currentView }}</span>
                    </div>
                    <router-view v-slot="{ Component }">
                        <keep-alive>
                            <component :is="Component" />
                        </keep-alive>
                    </router-view>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import PageHeader from "../components/tools/PageHeader.vue";
import MenuList from "../components/tools/MenuList.vue";

const menu = [
    //type: MenuItem|SubMenu
    {
        type: "MenuItem",
        router: "/admin/organization_view",
        icon: "Document",
        title: "社团列表",
    },
    {
        type: "SubMenu",
        title: "加分条管理",
        icon: "EditPen",
        items: [
            {
                router: "/admin/point_approval",
                title: "加分审批",
            },
            {
                router: "/admin/approved_list",
                title: "已通过加分条",
            },
        ],
    },
    {
        type: "SubMenu",
        title: "社团负责人管理",
        icon: "User",
        items: [
            {
                router: "/admin/member_approval",
                title: "申请审批",
            },
            {
                router: "/admin/member_list",
                title: "负责人列表",
            },
        ],
    },
    {
        type: "MenuItem",
        router: "/admin/student_info_import",
        icon: "Edit",
        title: "学生信息录入",
    },
];
const defaultActive = ref(null);
const currentView = ref("");
function viewChange() {
    console.log(111);
}
onMounted(() => {
    //解决刷新后面包屑为空白
    const currentRouter = window.location.pathname;
    menu.find((item, index_1) => {
        if (item.type === "MenuItem" && item.router === currentRouter) {
            defaultActive.value = String(index_1);
            currentView.value = item.title;
            return true
        }
        if (item.type === "SubMenu") {
            const { items: subMenu } = item
            subMenu.forEach(({ router, title }, index_2) => {
                if (router === currentRouter) {
                    defaultActive.value = `${index_1}-${index_2}`;
                    currentView.value = title;
                    return true
                }
            })
        }
        return false
    })
});
</script>

<style lang="scss" scoped>
.index-page {
    display: flex;
    flex-direction: column;
    height: 100%;

    .el-header,
    .el-aside,
    .el-main {
        // border: 1px solid #000;
        padding: 0;
    }

    .el-aside {
        width: 220px;
        background-color: #545c64;
        overflow-x: hidden;

        .el-menu {
            width: calc(100% + 1px);

            a {
                text-decoration: none;
            }

            .el-sub-menu {
                .el-menu-item {
                    font-size: 13px;
                }
            }
        }
    }

    .el-main {
        padding: 20px 30px 40px 30px;

        .view-container {
            padding: 8px;
            box-shadow: 1px 2px 10px rgba($color: #000000, $alpha: 0.1);

            .current-view {
                display: flex;
                align-items: center;
                color: #555;
                font-size: 14px;

                span {
                    margin-left: 3px;
                    border-bottom: 1px solid #409eff;
                }
            }
        }
    }
}
</style>