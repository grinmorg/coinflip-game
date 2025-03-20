"use client";
import { useActualPrice } from "@/context/actual-price-context";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
}

export const ActualEthPrice: React.FC<
  Props
> = ({ className }) => {
  const { ethPrice } = useActualPrice();
  return (
    <div
      className={cn(
        "flex items-center gap-x-2",
        className
      )}>
      <span className='text-lg font-semibold bg-secondary px-2 py-0.5 rounded-b-xl inline-block'>
        1 ETH ~ {ethPrice}$
      </span>
    </div>
  );
};
