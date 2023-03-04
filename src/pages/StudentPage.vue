<template>
    <div class="index-page">
        <PageHeader title="加分管理系统-用户界面" />
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
import MenuList from "../components/tools/MenuList.vue";
import PageHeader from "../components/tools/PageHeader.vue";

const menu = [
    // {
    //     type: "MenuItem",
    //     router: "/student/point_account",
    //     icon: "Discount",
    //     title: "学分统计",
    // },
    {
        type: "MenuItem",
        router: "/student/organization_view",
        icon: "Tickets",
        title: "社团列表",
    },
    {
        type: "MenuItem",
        icon: "SetUp",
        router: "/student/member_apply",
        title: "申请成为负责人",
    },
    {
        type: "MenuItem",
        icon: "DocumentChecked",
        router: "/student/my_org",
        title: "我负责的社团",
    },
    {
        type: "MenuItem",
        router: "/student/activity_create",
        icon: "CirclePlus",
        title: "创建活动",
    },
    {
        type: "MenuItem",
        icon: "EditPen",
        router: "/student/add_apply",
        title: "提交活动加分表",
    },
    {
        type: "MenuItem",
        icon: "Finished",
        router: "/student/apply_list",
        title: "社团活动加分条",
    },
    {
        type: "MenuItem",
        icon: "User",
        router: "/student/personal_point",
        title: "个人加分情况",
    },
    // {
    //     type: "SubMenu",
    //     router: "/student/member_apply",
    //     icon: "User",
    //     title: "社团负责人",
    //     items: [
    //         {
    //             router: "/student/member_apply",
    //             title: "负责申请",
    //         },
    //         {
    //             router: "/student/my_org",
    //             title: "我负责的",
    //         },
    //         {
    //             router: "/student/add_apply",
    //             title: "提交加分表",
    //         },
    //         {
    //             router: "/student/apply_list",
    //             title: "审批情况",
    //         },
    //     ],
    // },
    // {
    //     type: "SubMenu",
    //     title: "加分申请",
    //     icon: "Finished",
    //     items: [
    //         {
    //             router: "/student/add_apply",
    //             title: "提交申请",
    //         },
    //         {
    //             router: "/student/apply_list",
    //             title: "申请列表",
    //         },
    //     ],
    // },
];

const currentView = ref("");
const defaultActive = ref(null);
function viewChange() {
    console.log(111);
}

onMounted(() => {
    //解决刷新后面包屑为空白
    const currentRouter = window.location.pathname;
    menu.forEach((item, index_1) => {
        if (item.type === "MenuItem" && item.router === currentRouter) {
            defaultActive.value = String(index_1);
            currentView.value = item.title;
        }
        if (item.type === "SubMenu") {
            const { items: subMenu } = item
            subMenu.forEach(({ router, title }, index_2) => {
                if (router === currentRouter) {
                    defaultActive.value = `${index_1}-${index_2}`;
                    currentView.value = title;
                }
            })
        }
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

            // box-shadow: 1px 2px 10px rgba($color: #000000, $alpha: 0.1);
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