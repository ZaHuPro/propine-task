import { get } from 'lodash';
import fetch from 'node-fetch';
import { tokenPriceEndpointURL } from './config';

/**
 * Extracting and transforming the valid data from the API call
 * @param  {array} tokens Array of token symbol
 * @param  {object} data JSON response from the external API call
 * @returns  {object} Extracting and transforming token price data 
 */
const extractData = (tokens, data) => tokens.reduce((acc, obj) => ({ ...acc, [obj]: get(data, `${obj}.USD`, 0) }), {});

/**
 * Calling the external API for exchange rates
 * @param  {array} tokens Array of token symbol
 * @returns  {object} JSON response from the external API call
 */
const fetchTokenPriceInUSD = async (tokens) => {
  try {
    const res = await fetch(`${tokenPriceEndpointURL}&fsyms=${tokens.join(',')}`);
    const data = await res.json();
    return extractData(tokens, data);
  } catch (err) {
    return console.error(err);
  }
};

export default fetchTokenPriceInUSD;
