Coinbase = function() {

  var btc_price_placeholder = $("#btc-price")

  var init = function() {
    console.log("attempting to connect to Gdax...")
    if ("WebSocket" in window){
      console.log("WebSocket is supported");
      var ws = new WebSocket("wss://ws-feed-public.sandbox.pro.coinbase.com");

      var options = {
          "type": "subscribe",
          "product_ids": [
              "BTC-USD"
          ],
          "channels": [
              "level2",
              "heartbeat",
              {
                  "name": "ticker",
                  "product_ids": [
                      "BTC-USD"
                  ]
              }
          ]
      }
      var last_price = 0.0

      ws.onopen = function() {
        console.log("websocket opened. sending message")
        ws.send(JSON.stringify(options))
      }

      ws.onmessage = function (event){ 
        var msg = event.data;
        console.log("Message is received: ", msg);
        data = JSON.parse(event.data)
        if(data['type'] == 'ticker'){
          btc_price_placeholder.text("$" + data['price'])
          if(data['price'] >= last_price){
            btc_price_placeholder.css('color', 'green')
          } else {
            btc_price_placeholder.css('color', 'red')
          }
          last_price = data['price']
        }
      };

      ws.onclose = function(){ 
        // websocket is closed.
        console.log("Connection to gdax closed..."); 
      };
        
      window.onbeforeunload = function(event) {
        socket.close();
      };
    }
  }

  init()
}