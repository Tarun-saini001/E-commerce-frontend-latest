const BASE_URL = import.meta.env.VITE_API_URL;


export const ENDPOINTS = {
    USER: {
        LOGIN: `${BASE_URL}/service/user/login`,
        REGISTER: `${BASE_URL}/service/user/send-otp`,
    },
    PRODUCT: {
        GET_ALL: `${BASE_URL}/service/product/`,
        GET_BY_ID: (id: string) => `${BASE_URL}/service/product/${id}`
    },
    WISHLIST: {
        GET: `${BASE_URL}/service/wishlist`,
        TOGGLE: `${BASE_URL}/service/wishlist/toggle`,
    },
    CART: {
        ADD:`${BASE_URL}/service/cart/add`,
        REMOVE_ITEM: (productId: string) => `${BASE_URL}/service/cart/${productId}`,
        CLEAR:`${BASE_URL}/service/cart/`,
        UPDATE_QUANTITY:(productId:string)=>`${BASE_URL}/service/cart/update/${productId}`
    },
    CATEGORY: {
        GET_ALL: ({ page, limit }: { page?: number; limit?: number }) => `${BASE_URL}/service/category/?page=${page}&limit=${limit}`,
        ALL_WITHUOT_PAGINATION: `${BASE_URL}/service/category/withoutPagination`
    },
    ORDER: {
        GET_BY_ID: (id: string) => `${BASE_URL}/service/order/${id}`,
        GET_ALL: ({ page, limit }: { page?: number; limit?: number }) => `${BASE_URL}/service/order/orders?page=${page}&limit=${limit}`,
        GET_USER_ORDERS: `${BASE_URL}/service/order/`
    }
}