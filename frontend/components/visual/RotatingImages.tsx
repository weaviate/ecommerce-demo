"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface RotatingImagesProps {
  images: string[];
  interval?: number; 
}

const RotatingImages: React.FC<RotatingImagesProps> = ({
  images,
  interval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, images.length]);

  return (
    <div className="relative">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute top-10 left-5 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={`https://d3o574pyao1sq3.cloudfront.net/fashion/${src}.png`}
            alt={`Rotating image ${index + 1}`}
            height={400}
            width={400}
            className="object-cover rounded-sm"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default RotatingImages;
