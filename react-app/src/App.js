import React, { useEffect, useState } from "react";

function App() {
  const [orderBook, setOrderBook] = useState({ buys: [], sells: [] });

  useEffect(() => {
    const worker = new Worker(new URL("./worker.js", import.meta.url));

    worker.postMessage("start");

    worker.onmessage = (e) => {
      setOrderBook(e.data);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Order Book</h1>
        <div className="order-book">
          <div className="buys">
            <h2>Buys</h2>
            {orderBook.buys.map((order, index) => (
              <div key={index}>
                Price: {order.price}, Amount: {order.amount}
              </div>
            ))}
          </div>
          <div className="sells">
            <h2>Sells</h2>
            {orderBook.sells.map((order, index) => (
              <div key={index}>
                Price: {order.price}, Amount: {order.amount}
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
