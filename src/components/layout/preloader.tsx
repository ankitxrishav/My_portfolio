
'use client';

export default function Preloader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      <h1 id="preloader-text" className="font-headline tracking-wider text-white text-center p-4">
        {'Ankit\'s Portfolio'.split('').map((char, index) => (
          <span key={index} style={{ opacity: 0 }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      <div id="preloader-percentage" className="font-code">
        0%
      </div>
    </div>
  );
}
