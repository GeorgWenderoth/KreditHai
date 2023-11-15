import axios from 'axios';
import React, {useState} from "react";
require('dotenv').config()
/**
 * Übernimmt die axios calls anhand der übergebenen parameter, und returnt das propmise / ergebnis
 * @param method
 * @param url
 * @param object
 * @returns {AxiosPromise}
 * @constructor
 */
export function AxiosCalls(method,url, object){


    const firstHalfUrl = process.env.REACT_APP_URL;
    console.log(`FirsthalfUrl: ${process.env.REACT_APP_URL}` );
    const firstHalfUrlwithoutEnv = 'http://127.0.0.1:8081';
   const call = axios({
        method: method,
        url: firstHalfUrl + url,
        data: object,
    })
    return call;
}