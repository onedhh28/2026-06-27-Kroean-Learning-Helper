"use client";

type LibraryFiltersProps = {
  chapters: string[];
  sources?: string[];
  search: string;
  setSearch: (value: string) => void;
  chapter: string;
  setChapter: (value: string) => void;
  source?: string;
  setSource?: (value: string) => void;
};

export function LibraryFilters({
  chapters,
  sources = [],
  search,
  setSearch,
  chapter,
  setChapter,
  source,
  setSource
}: LibraryFiltersProps) {
  return (
    <section className="panel mb-5 grid gap-3 p-4 md:grid-cols-[1fr_180px_180px]">
      <input
        className="field"
        placeholder="搜尋韓文 / 中文 / 英文"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <select className="field" value={chapter} onChange={(event) => setChapter(event.target.value)}>
        <option value="">全部來源</option>
        {chapters.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      {setSource ? (
        <select className="field" value={source} onChange={(event) => setSource(event.target.value)}>
          <option value="">全部來源</option>
          {sources.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      ) : null}
    </section>
  );
}
