import serverPath from '../../serverPath';

export const getCart = () => {
    return async (dispatch, getState) => {
        const response = await fetch(serverPath+`/cart`, {credentials:"include"});
        const jsonResponse = await response.json();
        if (jsonResponse.message != "NOT AUTHENTICATED") dispatch({type: 'cart/getCart', payload: jsonResponse});
    }
}

export const addToCart = (productID, quantity) => {
    return async (dispatch, getState) => {
        const response = await fetch(serverPath+`/cart`,
            {method:"POST", headers: {"Content-Type":"application/json"}, credentials:"include", body:JSON.stringify({productID,quantity})});
        const jsonResponse = await response.json();
        if (!jsonResponse.message) dispatch({type: 'cart/addToCart', payload: jsonResponse});
        else if (jsonResponse.message === "insufficient quantity in stock") dispatch({type: 'cart/insufficientQuantity', payload: productID});
    }
}

export const modifyCart = (productID, quantity) => {

}

export const removeFromCart = (productID) => {
    return async (dispatch, getState) => {
        const response = await fetch(serverPath+`/cart`,
            {method:"DELETE", headers: {"Content-Type":"application/json"}, credentials:"include", body:JSON.stringify({productID})});
        const jsonResponse = await response.json();
        if (jsonResponse.message == "ACCEPTED") dispatch({type: 'cart/removeFromCart', payload: {productID}});
    }
}

export const purchaseCart = () => {
    return async (dispatch, getState) => {
        const response = await fetch(serverPath+'/cart/checkout', {credentials:"include"});
        const jsonResponse = await response.json();
        if (jsonResponse.message == "transaction successful") dispatch({type: 'cart/purchaseCart', payload: jsonResponse});
    }
}

export const clearCart = () => { // clears cart store when logging out
    return (dispatch, getState) => {
        dispatch({type: 'cart/clearCart'});
    }
}

export function selectCart(state) {return state.cart};
