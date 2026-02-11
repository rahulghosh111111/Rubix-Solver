"use client";
import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, Loader2, Maximize } from 'lucide-react';

declare const cv: any;

export default function Scanner({ onCapture }: { onCapture: (colors: string[]) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [isCvLoaded, setIsCvLoaded] = useState(false);

  useEffect(() => {
    const checkCV = setInterval(() => {
      if (typeof cv !== 'undefined' && cv.Mat) {
        setIsCvLoaded(true);
        clearInterval(checkCV);
      }
    }, 500);
    return () => clearInterval(checkCV);
  }, []);

  // Optimized for mobile and desktop frames
  const videoConstraints = {
    width: { ideal: 640 },
    height: { ideal: 640 },
    facingMode: "environment",
    aspectRatio: 1 // Forces a square frame
  };

  const capture = useCallback(() => {
    if (!isCvLoaded || !webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
       // Using dummy data for the flow - replace with OpenCV logic provided earlier
       onCapture(Array(9).fill('U'));
    }
  }, [isCvLoaded, onCapture]);

  return (
    <div className="flex flex-col items-center w-full px-2">
      {/* Responsive Container: 
         - Takes 90% of width on mobile (max-w-[90vw])
         - Caps at 400px on desktop
         - Aspect-square ensures the frame is always a perfect square 
      */}
      <div className="relative w-full max-w-[400px] aspect-square rounded-3xl overflow-hidden border-4 border-blue-600 shadow-2xl shadow-blue-500/20 bg-black">
        
        {!isCvLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-blue-400 font-mono text-sm tracking-widest animate-pulse">
              LOADING COMPUTER VISION...
            </p>
          </div>
        )}

        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          // object-cover ensures the video fills the square without stretching
          className="w-full h-full object-cover" 
        />
        
        {/* The 3x3 Scanning Grid Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-3/4 h-3/4 grid grid-cols-3 grid-rows-3 border-2 border-white/40 backdrop-blur-[1px]">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/20 flex items-center justify-center relative">
                 {/* Visual guides for corners */}
                 {i === 0 && <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-400" />}
                 {i === 2 && <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-400" />}
                 {i === 6 && <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-400" />}
                 {i === 8 && <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-400" />}
                 <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Scan Button - Floating inside the frame for better reach on mobile */}
        <div className="absolute bottom-6 w-full flex justify-center z-20">
          <button
            onClick={capture}
            disabled={!isCvLoaded}
            className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-8 py-3 rounded-full font-bold shadow-xl transition-all disabled:bg-gray-800"
          >
            <Camera size={24} className="group-hover:rotate-12 transition-transform" />
            <span>CAPTURE FACE</span>
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest font-semibold">
        <Maximize size={12} />
        Place face inside the blue borders
      </div>
    </div>
  );
}