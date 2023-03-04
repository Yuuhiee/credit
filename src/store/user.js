import { defineStore } from "pinia";
import { ref, watch } from "vue";
export const useUserStore = defineStore('user', () => {
    const username = ref('')
    const token = ref('')
    if (sessionStorage['username'])
        username.value = sessionStorage['username']
    if (sessionStorage['token'])
        token.value = sessionStorage['token']
    watch(username, (username) => username ? sessionStorage.setItem('username', username) : sessionStorage.removeItem('username'))
    watch(token, (token) => token ? sessionStorage.setItem('token', token) : sessionStorage.removeItem('token'))
    return { username, token }
})