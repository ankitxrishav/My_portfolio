
'use client';

export default function PreloaderTypewriter() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      <h1 id="preloader-text" className="font-headline tracking-wider text-white text-center p-4">
        {"Ankit's Portfolio".split('').map((char, index) => (
          <span key={index} className="preloader-letter opacity-0">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
        <span id="cursor" className="inline-block w-1 h-8 md:h-12 bg-white ml-1 align-bottom"></span>
      </h1>
    </div>
  );
}
