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


   /* const firstHalfUrl = process.env.REACT_APP_URL;
    console.log(`FirsthalfUrl: ${process.env.REACT_APP_URL}` );
    const firstHalfUrlwithoutEnv = 'http://127.0.0.1:8081';
   const call = axios({
        method: method,
        url: firstHalfUrl + url,
        data: object,
    })
    return call; */
    const firstHalfUrl = process.env.REACT_APP_URL || 'http://127.0.0.1:8081';

        return axios({
            method: method,
            url: firstHalfUrl + url,
            data: object,
        })
        .then(response => response) // Erfolgreiche Antwort
        .catch(error => {
            // Fehler abfangen und verarbeiten
            if (error.response) {
                // Server-Antwort mit Statuscode, außerhalb des 2xx-Bereichs
                console.error("Server Error: ", error.response.data);
                // alert(error.response.data.message);
                throw new Error(error.response.data.message || "Serverfehler ist aufgetreten.");
            } else if (error.request) {
                // Anfrage wurde gesendet, aber keine Antwort erhalten
                console.error("Network Error: ", error.request);
                throw new Error("Netzwerkfehler. Keine Antwort vom Server.");
            } else {
                // Anderer Fehler, der beim Erstellen der Anfrage auftrat
                console.error("Error: ", error.message);
                throw new Error(error.message || "Ein unbekannter Fehler ist aufgetreten.");
            }
        });
}