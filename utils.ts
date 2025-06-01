export const random_sort = <T>(target: T[]) => {
  return Array.from(target, (val, i) => ({ val, rand: Math.random() }))
    .sort((a, b) => a.rand - b.rand)
    .map(m => m.val)
}