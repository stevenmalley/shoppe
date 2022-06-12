import { serverPath } from "../../config";

export const getOrder = (orderID) => {
    return async (dispatch, getState) => {
        const response = await fetch(`${serverPath}/orders/${orderID}`, {credentials:"include"});
        const jsonResponse = await response.json();
        if (jsonResponse.message != "NOT AUTHENTICATED") dispatch({type: 'orders/getOrder', payload: {orderID,sales:jsonResponse}});
    }
}

export const getOrders = () => {
    return async (dispatch, getState) => {
        const response = await fetch(`${serverPath}/orders`, {credentials:"include"});
        const jsonResponse = await response.json();
        if (jsonResponse.message!= "NOT AUTHENTICATED") dispatch({type: 'orders/getOrders', payload: jsonResponse});
    }
}

export function selectOrders(state) {return state.orders};
