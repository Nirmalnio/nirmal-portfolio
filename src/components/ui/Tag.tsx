export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full border border-line px-3 py-1 font-mono text-[0.78rem] text-muted transition-colors duration-200 hover:border-accent hover:text-accent">
      {children}
    </li>
  );
}
