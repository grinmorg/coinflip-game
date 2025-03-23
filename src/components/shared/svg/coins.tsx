import { LucideProps } from "lucide-react";

export const COINS = {
  ETH: ({ ...props }: LucideProps) => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        width='100%'
        height='100%'
        viewBox='0 0 35 57'
        {...props}>
        <path
          fill='#fff'
          d='m17.495 0-.382 1.299v37.69l.382.382L34.991 29.03z'></path>
        <path
          fill='#fff'
          d='M17.496 0 0 29.03 17.496 39.37V0M17.494 42.684l-.215.262v13.427l.215.629L35 32.347z'></path>
        <path
          fill='#fff'
          d='M17.496 57.001V42.684L0 32.347zM17.497 39.371 34.992 29.03l-17.495-7.953zM0 29.03 17.495 39.37V21.077z'></path>
      </svg>
    );
  },
};
