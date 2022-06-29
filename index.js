require("dotenv").config()
const { Spot } = require("@binance/connector")
const bodyParser = require("body-parser")
const axios = require("axios")
const { Telegraf } = require("telegraf")


const TELEGRAM_API = `https://api.telegram.org/bot`+process.env.BOT_TOKEN
const CHAT_ID = process.env.CHAT_ID
const binance_api_key = process.env.BINANCE_API_KEY
const binance_secret = process.env.BINANCE_SECRET
const client = new Spot(binance_api_key, binance_secret)
const bot = new Telegraf(process.env.BOT_TOKEN)


bot.command('btc', (ctx) => {
    client.accountSnapshot('SPOT')
    .then(res => {
        for (let i = 0; i < res.data.snapshotVos[1].data.balances.length; i++) {
            const array = res.data.snapshotVos[1].data.balances
            const element = array[i];
            if (element.asset === "BTC")
                ctx.reply(element.free)
        }
    })
})
bot.command('eth', (ctx) => {
    client.accountSnapshot('SPOT')
    .then(res => {
        for (let i = 0; i < res.data.snapshotVos[1].data.balances.length; i++) {
            const array = res.data.snapshotVos[1].data.balances
            const element = array[i];
            if (element.asset === "ETH")
                ctx.reply(element.free)
        }
    })
})
bot.command('price', (ctx) => {
    axios.get("https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT")
    .then(res => {
        ctx.reply("BTC price is: "+Math.floor(res.data.price)+"$")
    })
})
bot.command('help', (ctx) => {
    ctx.reply("Liste des commandes disponible:\n\
/btc /eth (Montant des cryptos dans le wallet\n\
/price (Prix du Bitcoin)\
    ")
})
bot.launch()

function btcAlert(){
    axios.get("https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT")
    .then(res => {
        if (res.data.price >= 44000)
            axios.get(TELEGRAM_API+"/sendMessage?chat_id="+CHAT_ID+"&text=BTC is up "+Math.floor(res.data.price)+"$!")
        if (res.data.price <= 36000)
            axios.get(TELEGRAM_API+"/sendMessage?chat_id="+CHAT_ID+"&text=BTC is up "+Math.floor(res.data.price)+"$!")
    })
}


setInterval(() => {
    btcAlert()
}, 1800000)