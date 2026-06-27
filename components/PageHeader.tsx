import Link from "next/link";

type PageHeaderProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function PageHeader({ title, description, actionHref, actionLabel }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-normal text-ink">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn-primary">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
