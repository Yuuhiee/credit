import { defineStore } from "pinia";
import { ref, watch } from "vue";
import CryptoJS from 'crypto-js';
export const useRouterStore = defineStore('router', () => {
    const extraRouter = ref({})
    if (localStorage['extraRoute'])
        extraRouter.value = JSON.parse(CryptoJS.AES.decrypt(localStorage['extraRoute'], 'a').toString(CryptoJS.enc.Utf8))
    watch(extraRouter, (router) => {
        JSON.stringify(router) == '{}' ?
            localStorage.removeItem('extraRoute') :
            localStorage.setItem('extraRoute', CryptoJS.AES.encrypt(JSON.stringify(router), 'a').toString())
    })
    return { extraRouter }
})