import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import React from "react";

interface Props {
  className?: string;
  username: string | false;
  isWin: boolean;
  isLoading: boolean;
  isNotSelected?: boolean;
  onClick?: () => void;
}

export const UserCard: React.FC<
  Props
> = ({
  username,
  isWin,
  isLoading,
  isNotSelected = false,
  onClick,
  className,
}) => {
  return (
    <article
      className={cn(
        "flex flex-col items-center justify-center",
        className
      )}
      onClick={onClick}>
      <div
        className={cn(
          "rounded-full bg-accent flex items-center justify-center sm:w-32 w-16 sm:h-32 h-16 relative",
          isNotSelected &&
            "bg-transparent border-dashed border-6 border-accent opacity-50"
        )}>
        {!isNotSelected && (
          <div className='absolute bottom-0 sm:bottom-2 left-1/2 -translate-x-1/2'>
            {isWin && (
              <p className='text-white font-bold sm:text-lg bg-orange-500 px-1 sm:px-2 rounded'>
                WIN
              </p>
            )}
            {isLoading && (
              <p className='font-bold sm:text-lg bg-white px-1 sm:px-2 rounded animate-pulse'>
                ...
              </p>
            )}
          </div>
        )}
        <UserIcon className='text-white sm:w-16 w-8 sm:h-16 h-8' />
      </div>

      {!isNotSelected && username && (
        <p className='font-bold sm:text-base text-xs'>
          {username}
        </p>
      )}
    </article>
  );
};
