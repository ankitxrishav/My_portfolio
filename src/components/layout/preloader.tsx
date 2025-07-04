
'use client';

export default function Preloader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
    >
      <div className="absolute inset-0 w-full h-full bg-preloader-fluid opacity-20"></div>
      <div className="text-center">
        <h1
          id="preloader-text"
          className="font-headline text-2xl md:text-4xl text-white tracking-widest uppercase opacity-0"
          style={{ transform: 'scale(0.9)' }}
        >
          Ankit's Portfolio
        </h1>
      </div>
    </div>
  );
}
