import { useFrame } from "@react-three/fiber";
import anime, { AnimeInstance, AnimeParams } from "animejs";
import { useRef } from "react";

export function useAnimation(createAnimation: () => AnimeParams) {
  const animation = useRef<AnimeInstance>();
  const time = useRef(0);
  useFrame(({ invalidate }, delta) => {
    if (!animation.current) {
      const params = createAnimation();
      animation.current = anime({
        ...params,
        update: (e) => {
          params.update?.(e);
          invalidate();
        },
      });
    }
    animation.current.tick(time.current * 1000);
    time.current += delta;
  });
}
