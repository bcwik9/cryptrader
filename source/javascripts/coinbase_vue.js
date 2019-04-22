Vue.component('coinbase-crypto', {
    props: ['crypto'],
    template: '<h2 :style=crypto.style>{{crypto.pair}}: ${{crypto.price}}</h2>'
})

var coinbase_app = new Vue({
    el: "#coinbase-app",
    data: {
        cryptos: {
            'BTC-USD': {pair: 'BTC-USD', id: 0, price: 0, style: ''},
            'ETH-USD': {pair: 'ETH-USD', id: 1, price: 0, style: ''},
            'LTC-USD': {pair: 'LTC-USD', id: 2, price: 0, style: ''}
        }
    },
    methods: {
        init: function() {
            console.log('attempting to connect to Coinbase...')
            if ("WebSocket" in window){
                console.log("WebSocket is supported");
                var pairs = Object.keys(this.cryptos)
                var ws = new WebSocket("wss://ws-feed.pro.coinbase.com");
                var options = {
                    "type": "subscribe",
                    "product_ids": pairs,
                    "channels": [
                        "level2",
                        "heartbeat",
                        {
                            "name": "ticker",
                            "product_ids": pairs
                        }
                    ]
                }
                ws.onopen = function() {
                    console.log("websocket opened. sending message")
                    ws.send(JSON.stringify(options))
                }

                ws.onmessage = function (event){ 
                    var msg = event.data;
                    //console.log("Message is received: ", msg);
                    data = JSON.parse(event.data)
                    if(data['type'] == 'ticker'){
                        coinbase_app.ticker_message_received(data)
                    }
                };

                ws.onclose = function(){ 
                    // websocket is closed.
                    console.log("Connection to Coinbase closed..."); 
                };
                
                window.onbeforeunload = function(event) {
                    socket.close();
                };

            }
        },
        ticker_message_received: function(data){
            pair = data['product_id']
            style = "color:red"
            if(data['price'] >= this.cryptos[pair].price){
                style = "color:green"
            }
            this.cryptos[pair].price = parseFloat(data['price'])
            this.cryptos[pair].style = style
        }
    }
})

coinbase_app.init()