import { useEffect, useState } from "react";

export function useTypewriterEffect(text = "", speed = 100) {
  const [result, setResult] = useState("");

  useEffect(() => {
    setResult("");
    let index = 0;
    const timer = setInterval(() => {
      setResult((prev) => prev + text.charAt(index));
      index++;
      if (index > text.length) {
        clearInterval(timer);
      }
    }, speed);
    return () => {
      clearInterval(timer);
    };
  }, [text, speed]);

  return result;
}
