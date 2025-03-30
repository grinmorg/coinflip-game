import React from "react";
import { ConnectButton } from "../wagmi/connect-button";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Navigation } from "./navigation";

interface Props {
  className?: string;
}

export const Header: React.FC<
  Props
> = ({ className }) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between w-full py-2 px-3 sm:px-6",
        className
      )}>
      <Logo />

      <div className='flex items-center gap-x-2'>
        <Navigation />
        <ConnectButton />
      </div>
    </header>
  );
};
