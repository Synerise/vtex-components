export const search = async (
  _: any,
  { query, index, token }: { query: string; index: string; token: string },
  _ctx: Context
) => {
  const res = await fetch(
    `https://api.synerise.com/search/v2/indices/${index}/autocomplete?query=${query}&limit=8&token=${token}`
  )

  const { data } = await res.json()

  return data
}
