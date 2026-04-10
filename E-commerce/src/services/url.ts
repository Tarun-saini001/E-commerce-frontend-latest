const BASE_URL = import.meta.env.VITE_API_URL;


export const ENDPOINTS = {
    USER: {
        LOGIN: `${BASE_URL}/service/user/login`,
        REGISTER: `${BASE_URL}/service/user/send-otp`,
    },
    PRODUCT: {
        GET_ALL: `${BASE_URL}/service/product/`
    },
    WISHLIST: {

    },
    CART: {

    },
    CATEGORY: {

    },
    ORDER: {

    }
}