import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import NotFound from '@/pages/NotFound.vue'
import { nextTick, toRaw } from 'vue'
import { useRouterStore } from '../store/router'
import { useUserStore } from '../store/user'
import CryptoJS from 'crypto-js';

let userStore
let routerStore
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            component: LoginPage,
            meta: {
                title: "统一身份认证"
            }
        },
        // {
        //     path: '/register',
        //     component: RegisterPage
        // },
        {
            path: '/404',
            component: NotFound,
            meta: {
                title: "404"
            }
        },
        {
            path: '/:pathMatch(.*)',
            redirect: '/404'
        }
    ]
})
//路由守卫
router.beforeEach((to, from, next) => {
    const { token } = userStore
    //每次检查一下路由
    router.checkRoute()
    // 判断该路由是否需要登录权限
    if (to.meta.requireAuth) {
        if (token != null) {
            next()
        } else {
            next({ path: '/login' })
        }
    } else {
        next()
    }
    if (to.meta.title) {
        document.title = to.meta.title
    }
})
//删除添加的路由
router.reset = function () {
    if (router.hasRoute('admin'))
        router.removeRoute('admin')
    if (router.hasRoute('student'))
        router.removeRoute('student')
    routerStore.extraRouter = {}
}
router.checkRoute = function () {
    // const { extraRouter } = store.state
    const { extraRouter } = routerStore
    const { token } = userStore
    //如果没有token,删除路由,有就添加
    if (token !== null && JSON.stringify(extraRouter) != '{}')
        this.saveRouter(toRaw(extraRouter))
    else
        this.reset()
}
//动态添加学生(用户)的路由
router.addUserRoute = function () {
    const route = {
        name: 'student',
        path: '/student',
        redirect: '/student/index',
        _component: 'StudentPage',
        meta: {
            requireAuth: true,
            title: "Hitwh_加分管理系统"
        },
        children: [
            {
                path: 'index',
                _component: 'IndexBackground'
            },
            {
                path: 'add_apply',
                _component: 'AddApply',
            },
            {
                path: 'apply_list',
                _component: 'ApplyList',
            },
            {
                path: 'my_org',
                _component: 'MyOrganization',
            },
            {
                path: 'member_apply',
                _component: 'MemberApply',
            },
            {
                path: 'organization_view',
                _component: 'OrganizationView',
            },
            {
                path: "activity_create",
                _component: "ActivityCreate",
            },
            {
                path: "personal_point",
                _component: "PersonalPoint",
            },
        ]
    }
    this.saveRouter(route)
}
//动态添加管理员的路由
router.addAdminRoute = function () {
    const route = {
        name: 'admin',
        path: "/admin",
        redirect: '/admin/index',
        _component: "AdminPage",
        meta: {
            requireAuth: true,
            title: "Hitwh_加分管理系统"
        },
        children: [
            {
                path: "index",
                _component: "IndexBackground",
            },
            {
                path: "point_approval",
                _component: "PointApproval",
            },
            {
                path: "approved_list",
                _component: "ApprovedList",
            },
            {
                path: "member_approval",
                _component: "MemberApproval",
            },
            {
                path: "organization_view",
                _component: "OrganizationView",
            },
            {
                path: "member_list",
                _component: "MemberList",
            },
            {
                path: "student_info_import",
                _component: "StudentInfoImport",
            },
        ],
    }
    this.saveRouter(route)
}

const readComponents = (router) => {
    const routePathToPage = import.meta.glob(`../pages/**.vue`)
    const routePathToComponent = import.meta.glob(`../components/**.vue`)
    if (router._component && !router.component) {
        //根据组件名_component获得懒加载函数 ()=>import(path),获得component
        router.component = routePathToPage[`../pages/${router._component}.vue`]
        //加载子组件的component
        router.children.forEach((child) => {
            child.component = routePathToComponent[`../components/${child._component}.vue`]
        })
    }
}
const doActionPageIn = () => {
    if (!localStorage['extraRoute']) return
    const extraRouter = JSON.parse(CryptoJS.AES.decrypt(localStorage['extraRoute'], 'a').toString(CryptoJS.enc.Utf8))
    readComponents(extraRouter)
    router.addRoute(extraRouter)
}
//根据所给的路由配置加入到router中
router.saveRouter = function (route = {}) {
    //将配置保存到本地
    routerStore.extraRouter = route
    readComponents(route)
    this.addRoute(route)
}

nextTick(() => {
    userStore = useUserStore()
    routerStore = useRouterStore()
    router.checkRoute()
})
doActionPageIn()
export default router