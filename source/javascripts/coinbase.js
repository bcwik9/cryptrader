Coinbase = function() {

  var price_list = $("#price-list")

  var init = function() {
    console.log("attempting to connect to Coinbase...")
    if ("WebSocket" in window){
      console.log("WebSocket is supported");
      var ws = new WebSocket("wss://ws-feed.pro.coinbase.com");
      var cryptos = ['BTC-USD', 'ETH-USD']
      var options = {
          "type": "subscribe",
          "product_ids": cryptos,
          "channels": [
              "level2",
              "heartbeat",
              {
                  "name": "ticker",
                  "product_ids": cryptos
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
        price_placeholder = price_list.find("#" + data['product_id'])
        if(data['type'] == 'ticker'){
          if(!price_placeholder.length){
            price_list.append('<div id="' + data['product_id'] + '"></div>')
          }
          price_placeholder.text(data['product_id'] + " $" + data['price'])
          if(data['price'] >= last_price){
            price_placeholder.css('color', 'green')
          } else {
            price_placeholder.css('color', 'red')
          }
          last_price = data['price']
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
  }

  init()
}