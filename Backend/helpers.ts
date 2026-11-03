export function paginate(page?: number, limit?: number) {
  const p = Math.max(1, page || 1)
  const l = Math.min(100, Math.max(1, limit || 20))
  return { skip: (p - 1) * l, limit: l, page: p }
}
