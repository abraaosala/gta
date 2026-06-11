import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, lastPage, total, from, to, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(lastPage, page + 1);
  if (start > 1) pages.push(1);
  if (start > 2) pages.push(-1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < lastPage - 1) pages.push(-2);
  if (end < lastPage) pages.push(lastPage);

  return (
    <div className="flex items-center justify-between mt-6">
      <span className="text-xs text-slate-400">
        {from}–{to} de {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) =>
          p < 0 ? (
            <span key={`e${i}`} className="px-1 text-xs text-slate-300">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[28px] h-7 text-xs font-bold rounded-lg cursor-pointer ${
                p === page
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= lastPage}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
