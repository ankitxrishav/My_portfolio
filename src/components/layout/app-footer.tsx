
export default function AppFooter() {
  return (
    <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>&copy; Ankit Kumar</p>
        <p className="mt-1">
          Made with{' '}
          <svg viewBox="0 0 24 24" fill="currentColor" className="inline h-4 w-4 text-accent">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {' '}by Fenrir
        </p>
      </div>
    </footer>
  );
}
