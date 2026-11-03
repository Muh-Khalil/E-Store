export default function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className='mt-6 flex items-center justify-center gap-2'>
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className='rounded border px-3 py-1 disabled:opacity-40'>Prev</button>
      <span className='px-2 text-sm text-gray-600'>Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className='rounded border px-3 py-1 disabled:opacity-40'>Next</button>
    </div>
  )
}
