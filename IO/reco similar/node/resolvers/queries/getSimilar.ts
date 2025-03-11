const TRACKER_KEY = '089b13d4-d8b5-439f-a1ad-d932c9c1802a'

export const getSimilar = async (
  _: any,
  { itemId, itemCatalogName }: { itemId: string; itemCatalogName: string },
  _ctx: Context
) => {
  try {
    const res = await fetch(
      `https://api.synerise.com/recommendations/v2/recommend/items/${itemId}/similar?token=${TRACKER_KEY}&itemCatalogId=${itemCatalogName}`
    )

    if (!res.ok) {
      throw new Error('Something went wrong while retrieving Synerise data')
    }

    const { data } = await res.json()

    return data
  } catch (err) {
    console.error(err)

    return null
  }
}
