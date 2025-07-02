
interface Order {
    price: number;
    quantity: number;
    orderId: string;
}

interface Bid extends Order {
    side: 'bid';
}

interface Ask extends Order {
    side: 'ask';
}

interface Orderbook {
    bids: Bid[];
    asks: Ask[];
}

export const orderbook: Orderbook = {
  bids: [
    
  ],
  asks: [
    
  ]
}

export const bookWithQuantity: {bids: {[price: number]: number}; asks: {[price: number]: number}} = {
    bids: {},
    asks: {}
}