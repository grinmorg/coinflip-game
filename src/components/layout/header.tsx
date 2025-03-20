import React from "react";
import { ConnectButton } from "../wagmi/connect-button";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export const Header: React.FC<
  Props
> = ({ className }) => {
  return (
    <header
      className={cn(
        "flex items-center justify-end p-2",
        className
      )}>
      <div className='flex items-center gap-x-2'>
        <ConnectButton />
      </div>
    </header>
  );
};
