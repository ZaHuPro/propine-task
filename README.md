# Propine programming task

A command line program that handles the CSV of the crypto investor transactions

## Installation 

In terminal:   
```js   
$ git clone <repository clone url>
$ cd propine-task
$ npm install
```

## Example Usage   

###  No parameters 
Returns the latest portfolio value per token in USD

```js   
npm run start
```
###  Specifying the token
Returns the latest portfolio value for respective token in USD

```js   
npm run start -- -t BTC
```
> Note: BTC can be replaced with any token symbol.

###  Specifying the date
Returns the portfolio value per token in USD on that respective date

```js   
npm run start -- -d 1571815546

or

npm run start -- -d "Sun May 09 2021 23:29:40 GMT+0530 (India Standard Time)"
```
> Note: Date can be a unix epoch or a valid date.

###  Specifying the CSV file path
Will read the CSV file form the specified path

```js   
npm run start -- -p /Volumes/propine-task/assets/transactions.csv   
```
> Note: Should be full path of the file


###  Specifying multiple options

```js   
npm run start -- -d 1571815546 -t BTC
```

## Example Output

|  Symbol  |  Overall Deposit  |  Overall Withdraw  |      Balance      |  Balance in USD Price  |
| :------- | :---------------- | :----------------- | :---------------- | :--------------------- |
|   BTC    |3600302.3045333605 |2399877.152365329   |1200425.1521680313 |69056785703.26          |
|   ETH    |2701342.9635697785 |1799638.6804448667  |901704.2831249118  |3526240837.76           |
|   XRP    |2702268.833703047  |1798935.852329967   |903332.98137308    |1362226.14              |
