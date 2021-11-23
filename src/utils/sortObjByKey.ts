export default function sortObjByKey<
  Obj extends Record<string, any> = Record<string, any>
>(obj: Obj): Obj {
  return Object.entries(obj)
    .sort(([a], [b]) => {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })
    .reduce(
      (prev, [key, value]) => ({
        ...prev,
        [key]:
          typeof value === 'object' && !Array.isArray(value) && value !== null
            ? sortObjByKey(value)
            : value,
      }),
      {}
    ) as Obj
}
