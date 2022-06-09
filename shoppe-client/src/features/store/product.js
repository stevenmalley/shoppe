import { serverPath } from "../../config";

export const getAllProducts = () => {
    return async (dispatch, getState) => {
        const response = await fetch(`${serverPath}/product`);
        const jsonResponse = await response.json();
        dispatch({type: 'product/allProducts', payload: jsonResponse});
    }
};

export const getOneProduct = (id) => {
    return async (dispatch, getState) => {
        const response = await fetch(`${serverPath}/product/${id}`);
        const jsonResponse = await response.json();
        dispatch({type: 'product/oneProduct', payload: jsonResponse});
    }
};

export function selectProducts(state) {return state.product};