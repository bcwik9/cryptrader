Gdax = function() {

  var btc_price_placeholder = $("#btc-price")

  var init = function() {
    console.log("attempting to connect to Gdax...")
    if ("WebSocket" in window){
      console.log("WebSocket is supported");
      var ws = new WebSocket("wss://ws-feed.gdax.com");

      // see https://docs.gdax.com/?ruby#subscribe
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
        }
      };

      ws.onclose = function(){ 
        // websocket is closed.
        console("Connection to gdax closed..."); 
      };
        
      window.onbeforeunload = function(event) {
        socket.close();
      };
    }
  }

  init()
}