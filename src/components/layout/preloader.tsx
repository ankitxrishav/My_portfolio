
'use client';

export default function Preloader() {
  const name = "Ankit's Portfolio";

  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="relative text-center">
        <h1
          id="preloader-text"
          className="font-headline"
        >
          {name.split('').map((letter, index) => (
            <span key={index} className="preloader-letter">
              {letter}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
