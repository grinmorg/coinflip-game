"use client";
import React, {
  useRef,
  useEffect,
} from "react";
import Lottie, {
  LottieRefCurrentProps,
} from "lottie-react";
import animationData from "./coin-animate.json";

export const CoinFlip: React.FC<{
  triggerFlip: boolean;
  onComplete?: () => void;
}> = ({ triggerFlip, onComplete }) => {
  const lottieRef =
    useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (
      triggerFlip &&
      lottieRef.current
    ) {
      lottieRef.current.setSpeed(1); // Устанавливаем нормальную скорость
      lottieRef.current.goToAndPlay(0); // Запускаем с начала
    }
  }, [triggerFlip]);

  return (
    <div className='w-full h-full'>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        autoplay={false}
        onComplete={onComplete}
      />
    </div>
  );
};
