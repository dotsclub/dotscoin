const express = require("express");
const app = express();
const axios = require("axios");
const PORT = process.env.PORT || 3000;

app.use(require("cors")());

function dotscoinInfo() {
  let timestamp = new Date(
    new Date().setDate(new Date().getDate() - 7)
  ).getTime();
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.wavesplatform.com/v0/candles/7uvJHXfM2rRCCg4PFLGGYoSwU8GE4myB4xgzfzFspMKK/8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS?timeStart=${timestamp}&interval=1d`
      )
      .then((response) => {
        let length = response.data.data.length;
        while (!response.data.data[length - 1].data.close) length--;
        resolve(response.data.data[length - 1].data);
      })
      .catch(() => {
        reject({});
      });
  });
}

app.get("/", function (req, res) {
  axios
    .get(`http://marketdata.wavesplatform.com/api/markets`)
    .then((response) => {
      console.log("Request successfull");
      response.data.map((v) => {
        if (
          v.amountAssetID == "7uvJHXfM2rRCCg4PFLGGYoSwU8GE4myB4xgzfzFspMKK" &&
          v.priceAssetID == "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"
        ) {
          res.status(200).json(v);
          res.end();
        }
      });
    })
    .catch(() => {
      res.status(404).send("Page not found");
      res.end();
    });
});

app.get("/twentyfourhhigh", function (req, res) {
  let timestamp = new Date(
    new Date().setDate(new Date().getDate() - 7)
  ).getTime();
  axios
    .get(
      `https://api.wavesplatform.com/v0/candles/7uvJHXfM2rRCCg4PFLGGYoSwU8GE4myB4xgzfzFspMKK/8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS?timeStart=${timestamp}&interval=1d`
    )
    .then((response) => {
      let length = response.data.data.length;
      while (!response.data.data[length - 1].data.close) length--;
      res.status(200).send(`${response.data.data[length - 1].data.high}`);
    })
    .catch(() => {
      res.status(404).send("Page not found");
      res.end();
    });
});

app.get("/twentyfourhclose", function (req, res) {
  let timestamp = new Date(
    new Date().setDate(new Date().getDate() - 7)
  ).getTime();
  axios
    .get(
      `https://api.wavesplatform.com/v0/candles/7uvJHXfM2rRCCg4PFLGGYoSwU8GE4myB4xgzfzFspMKK/8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS?timeStart=${timestamp}&interval=1d`
    )
    .then((response) => {
      let length = response.data.data.length;
      while (!response.data.data[length - 1].data.close) length--;
      res.status(200).send(`${response.data.data[length - 1].data.close}`);
    })
    .catch(() => {
      res.status(404).send("Page not found");
      res.end();
    });
});

app.get("/twentyfourhvwap", function (req, res) {
  axios
    .get(`http://marketdata.wavesplatform.com/api/markets`)
    .then((response) => {
      console.log("Request successfull");
      response.data.map((v) => {
        if (
          v.amountAssetID == "7uvJHXfM2rRCCg4PFLGGYoSwU8GE4myB4xgzfzFspMKK" &&
          v.priceAssetID == "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"
        ) {
          res.status(200).json(v["24h_vwap"]);
          res.end();
        }
      });
    })
    .catch(() => {
      res.status(404).send("Page not found");
      res.end();
    });
});

app.get("/priceinusd", async function (req, res) {
  let dotscoin_price: any = await dotscoinInfo();
  let blockchain_res = await axios.get("https://blockchain.info/ticker");
  let blockchain_json = blockchain_res.data;
  let usd_price = +dotscoin_price.close * +blockchain_json.USD.last;
  res.status(200).send(`${usd_price.toFixed(8)}`);
});

app.get("/priceininr", async function (req, res) {
  let dotscoin_price: any = await dotscoinInfo();
  let blockchain_res = await axios.get("https://blockchain.info/ticker");
  let blockchain_json = blockchain_res.data;
  let usd_price = +dotscoin_price.close * +blockchain_json.USD.last;
  let usd_to_inr_res = await axios.get(
    "https://api.exchangeratesapi.io/latest?symbols=INR&base=USD"
  );
  let inr_price = +usd_to_inr_res.data.rates.INR * usd_price;
  res.status(200).send(`${inr_price.toFixed(8)}`);
});

app.get("/priceineth", async function (req, res) {
  let dotscoin_price: any = await dotscoinInfo();
  let blockchain_res = await axios.get("https://blockchain.info/ticker");
  let blockchain_json = blockchain_res.data;
  let usd_price = +dotscoin_price.close * +blockchain_json.USD.last;
  let usd_to_eth_res = await axios.get(
    "https://api.pro.coinbase.com/products/ETH-USD/stats"
  );
  let eth_price = usd_price / +usd_to_eth_res.data.last;
  res.status(200).send(`${eth_price.toFixed(8)}`);
});

app.get("/priceinltc", async function (req, res) {
  let dotscoin_price: any = await dotscoinInfo();
  let blockchain_res = await axios.get("https://blockchain.info/ticker");
  let blockchain_json = blockchain_res.data;
  let usd_price = +dotscoin_price.close * +blockchain_json.USD.last;
  let usd_to_eth_res = await axios.get(
    "https://api.pro.coinbase.com/products/LTC-USD/stats"
  );
  let eth_price = usd_price / +usd_to_eth_res.data.last;
  res.status(200).send(`${eth_price.toFixed(8)}`);
});

app.get("/priceinbch", async function (req, res) {
  let dotscoin_price: any = await dotscoinInfo();
  let blockchain_res = await axios.get("https://blockchain.info/ticker");
  let blockchain_json = blockchain_res.data;
  let usd_price = +dotscoin_price.close * +blockchain_json.USD.last;
  let usd_to_eth_res = await axios.get(
    "https://api.pro.coinbase.com/products/BCH-USD/stats"
  );
  let eth_price = usd_price / +usd_to_eth_res.data.last;
  res.status(200).send(`${eth_price.toFixed(8)}`);
});

app.get("/priceinxrp", async function (req, res) {
  let dotscoin_price: any = await dotscoinInfo();
  let blockchain_res = await axios.get("https://blockchain.info/ticker");
  let blockchain_json = blockchain_res.data;
  let usd_price = +dotscoin_price.close * +blockchain_json.USD.last;
  let usd_to_eth_res = await axios.get(
    "https://api.pro.coinbase.com/products/XRP-USD/stats"
  );
  let eth_price = usd_price / +usd_to_eth_res.data.last;
  res.status(200).send(`${eth_price.toFixed(8)}`);
});

app.get("/priceinwaves", async function (req, res) {
    let dotscoin_price: any = await dotscoinInfo();
    let waves_price_res = await axios.get("https://marketdata.wavesplatform.com/api/ticker/WAVES/BTC")
    let eth_price = +dotscoin_price.close / +waves_price_res.data["24h_close"]
    res.status(200).send(`${eth_price.toFixed(8)}`);
  });

app.listen(PORT, () => console.log(`Server started at post ${PORT}`));

//module.exports = app;
