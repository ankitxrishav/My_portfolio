
'use client';

export default function PreloaderShimmer() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      <h1 id="preloader-text" className="font-headline tracking-wider text-white text-center p-4">
        Ankit's Portfolio
      </h1>
    </div>
  );
}
