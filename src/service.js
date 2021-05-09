
import { get } from "lodash";
import fetch from 'node-fetch';
import { tokenPriceEndpointURL } from './config'

const extractData = (tokens, data) => {
    return tokens.reduce((acc, obj) => ({...acc, [obj]: get(data, `${obj}.USD`, 0) }), {})
}

export const fetchTokenPriceInUSD = async (tokens) => {
    try {
        const res = await fetch(`${tokenPriceEndpointURL}&fsyms=${tokens.join(',')}`);
        const data = await res.json();
        return extractData(tokens, data);
    } catch (err) {
        return console.error(err);
    }
}