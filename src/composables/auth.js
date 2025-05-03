import { useCookies } from "@vueuse/integrations/useCookies";

const TokenKey = 'auth';
const cookies = useCookies();

export function getToken() {
    return cookies.get(TokenKey);
}

export function setToken(token) {
    return cookies.set(
        TokenKey, 
        token, 
        {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
        sameSite: 'strict'
        },
    );
}

export function removeToken() {
    return cookies.remove(TokenKey);
}
