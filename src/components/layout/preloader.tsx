
'use client';

export default function Preloader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden"
    >
      <h1 id="preloader-text" className="font-headline">
        Ankit's Portfolio
      </h1>
      <canvas id="particle-canvas" className="absolute inset-0 w-full h-full"></canvas>
    </div>
  );
}
