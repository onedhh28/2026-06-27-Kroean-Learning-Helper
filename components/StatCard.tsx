type StatCardProps = {
  label: string;
  value: string | number;
  tone?: "teal" | "coral" | "slate";
};

export function StatCard({ label, value, tone = "teal" }: StatCardProps) {
  const toneClass = {
    teal: "bg-mint text-teal",
    coral: "bg-red-50 text-coral",
    slate: "bg-slate-100 text-ink"
  }[tone];

  return (
    <section className="panel p-5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-4 inline-flex rounded-lg px-3 py-2 text-3xl font-black ${toneClass}`}>{value}</p>
    </section>
  );
}
