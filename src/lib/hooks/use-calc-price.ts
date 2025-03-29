import { useActualPrice } from "@/context/actual-price-context";

export default function useCalcPrice() {
  const { ethPrice } = useActualPrice();

  const calcPriceInUSD = (
    price: string
  ) => {
    if (!ethPrice) return;

    return Math.floor(
      parseFloat(price) * ethPrice
    );
  };

  return {
    calcPriceInUSD,
  };
}
