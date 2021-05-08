import _colors from 'colors';

export const filePath = "../assets/min-transactions-test.csv";
// export const filePath = "../assets/transactions.csv";
export const  exchangeRatesAPI =  "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD&api_key=8a40e2ade21cbdf645ae47836bae9dcc5acf206b3296497542f8d44ac961bba5";
export const progressBarOptions = {
    format: `Processing CSV... |${_colors.cyan('{bar}')}| {percentage}% || {value}/{total}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
}