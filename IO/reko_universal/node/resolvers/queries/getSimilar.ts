const TRACKER_KEY = '089b13d4-d8b5-439f-a1ad-d932c9c1802a'
// const clientUUID = '8f1b3ea5-933b-498d-bee1-db7ff987b920'

// itemCatalogName: string,
export const getSimilar = async (
  _: any,
  { itemId, campaignId, uuid }: { itemId: string; campaignId: string, uuid: string },
  _ctx: Context
) => {
  try {
    const res = await fetch(
      `https://api.synerise.com/recommendations/v2/recommend/campaigns/${campaignId}?itemId=${itemId}&token=${TRACKER_KEY}&clientUUID=${uuid}`
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
