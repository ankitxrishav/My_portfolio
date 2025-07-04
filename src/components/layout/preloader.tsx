
'use client';

export default function Preloader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
    >
      <div className="text-center">
        <h1
          id="preloader-text"
          className="font-headline text-2xl md:text-4xl text-white tracking-widest uppercase"
        >
          Ankit's Portfolio
        </h1>
      </div>
    </div>
  );
}
