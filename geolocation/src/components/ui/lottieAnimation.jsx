import { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  style = {},
}) {
  const container = useRef(null);

  useEffect(() => {
    const instance = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet", // keeps aspect ratio and centers
      },
    });

    return () => instance.destroy();
  }, [animationData, loop, autoplay]);

  return (
    <div
      ref={container}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#c3daf5ff",
        borderRadius: "10%",
        ...style,
      }}
    />
  );
}