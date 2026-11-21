export function AdminPageHeader({
  title,
  description,
  eyebrow = "Back office",
  children,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </header>
  );
}
