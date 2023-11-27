const express = require('express')
const path = require('path')
const stocks = require('./stocks')

const app = express()
app.use(express.static(path.join(__dirname, 'static')))

app.get('/stocks', async (req, res) => {
  try {
    const stockSymbols = await stocks.getStocks(); 
    console.log(stockSymbols);
    res.json({ stockSymbols });
  } catch (error) {
    console.error(`Unable to fetching the stock datas.` );
    res.status(400).send(`Unable to fetching the stock datas.`);
  }
})

app.get('/stocks/:symbol', async (req, res) => {
  const {
     params: { symbol }, 
    } = req
  try {
    const data = await stocks.getStockPoints(symbol, new Date());
    console.log(symbol, data);
    res.json(data);
  } catch (error) {
    console.error(`Unable to fetching the stock data for: ${symbol}` );
    res.status(400).send(`Unable to fetching the stock data for: ${symbol}`);
  }
})

app.listen(3000, () => console.log('Server is running!'));
