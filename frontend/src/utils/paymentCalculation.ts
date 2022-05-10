export const paymentConfig = {
  basePrice: 2,
  willBeReturned: 2,
  pricePerBadge: 0.5
}

export const calculatePrice = (quantity: number) => {
  const {
    basePrice,
    willBeReturned,
    pricePerBadge
  }  = paymentConfig;

  const totalToPay = basePrice + willBeReturned + (pricePerBadge * quantity);
  return totalToPay
}