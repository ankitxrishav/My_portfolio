
'use client';

export default function Preloader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="relative text-center">
        <h1
          id="preloader-text"
          className="font-headline text-[15vw] md:text-[12vw] lg:text-[10vw] font-bold uppercase text-transparent bg-clip-text text-bg-animate"
          style={{
             lineHeight: 1,
          }}
        >
          Ankit's Portfolio
        </h1>
        <div 
          id="preloader-percentage" 
          className="absolute -bottom-4 right-0 md:-bottom-8 font-code text-2xl md:text-4xl text-white opacity-0"
        >
          0%
        </div>
      </div>
    </div>
  );
}
