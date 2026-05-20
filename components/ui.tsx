import Link from "next/link";
import { clsx } from "clsx";
import type { ReactNode } from "react";

export function PageShell({
  title,
  eyebrow,
  children,
  actions,
  className,
  headerClassName,
  contentClassName
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <div className={clsx("mx-auto max-w-7xl px-4 py-8 sm:py-10", className)}>
      <div className={clsx("relative mb-6 flex flex-col gap-4", headerClassName)}>
        {actions ? (
          <div className="flex justify-start sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2">
            {actions}
          </div>
        ) : null}
        <div className="w-full">
          <h1 className="mt-1 w-full text-center text-3xl font-bold text-lama-ink sm:text-4xl">
            {title}
          </h1>
        </div>
      </div>
      {contentClassName ? <div className={contentClassName}>{children}</div> : children}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={clsx("rounded-lg border border-lama-line bg-lama-card p-5 shadow-soft", className)}>
      {children}
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  className
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button className="inline-flex items-center justify-center gap-2 rounded-md bg-lama-detail px-4 py-2 text-sm font-bold text-white hover:bg-lama-ink focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2">
      {children}
    </button>
  );
}

export function StatusBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center rounded-full border border-lama-detail/40 bg-lama-cream px-3 py-1 text-xs font-bold uppercase text-lama-detail",
        className
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-lama-detail/50 bg-lama-card p-8 text-center">
      <p className="text-lg font-bold">{title}</p>
      <p className="mt-2 text-sm text-lama-ink/75">{text}</p>
    </div>
  );
}
