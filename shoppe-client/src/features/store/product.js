export const getAllProducts = () => {
    return async (dispatch, getState) => { // thunk receives dispatch and getState methods
        const response = await fetch("http://localhost:8080/product");
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        dispatch({type: 'product/allProducts', payload: jsonResponse});
    }
}

export const getOneProduct = (id) => {
    return async (dispatch, getState) => { // thunk receives dispatch and getState methods
        const response = await fetch(`http://localhost:8080/product/${id}`);
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        dispatch({type: 'product/oneProduct', payload: jsonResponse});
    }
}

export function selectProducts(state) {return state.product};