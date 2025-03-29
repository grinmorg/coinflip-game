import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

export const Logo: React.FC<Props> = ({
  className,
}) => {
  return (
    <Link
      href='/'
      className={cn(
        "font-bold uppercase text-2xl",
        className
      )}>
      Coin Flip Game
    </Link>
  );
};
