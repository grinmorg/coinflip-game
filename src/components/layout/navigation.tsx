"use client";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";

const items = [
  {
    label: "Leaderboard",
    href: ROUTES.LEADERBOARD,
  },
  {
    label: "My games",
    href: ROUTES.HISTORY,
    onlyAuth: true,
  },
];

interface Props {
  className?: string;
}

export const Navigation: React.FC<
  Props
> = ({ className }) => {
  const { isConnected } = useAccount();
  return (
    <nav className={cn(className)}>
      <ul className='flex items-center gap-x-8'>
        {items.map((i) => {
          if (
            i.onlyAuth &&
            !isConnected
          )
            return null;

          return (
            <li key={i.href}>
              <Link
                href={i.href}
                className='opacity-50 hover:opacity-100 transition font-semibold sm:text-xl uppercase'>
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
