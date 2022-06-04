/*
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
*/

export default function ProductDetails(props) {

    return (
        <div>
            <h3>{props.name}</h3>
            <p>{props.description}</p>
            <p>{props.price}</p>
        </div>
    );
}

    /*
    const location = useLocation();

    console.log(location);

    fetch("http://localhost:8080/"+location).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error("Request failed!");
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
        return <div>{jsonResponse}</div>;
    });
}
*/