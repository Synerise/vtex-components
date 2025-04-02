# Synerise Recommendation Slider

![Slider with recommended products](https://cdn.jsdelivr.net/gh/Synerise/vtex-components@main/IO/RecoSlider/docs/recommendation-slider-img.png)
The `synerise-recommendations` block is designed to display slider with recommended products based on provided Synerise recommendation campaign.

## Configuration

> ℹ️ **Initial requirements**  
> To ensure the component works correctly, you must have the `synerise-integration` app installed and have configured the Synerise plugin in VTEX for your workspace.  
> - Install the `synerise-integration` app by running:  
>   ```sh
>   vtex install synerisepartnerar.synerise-integration
>   ```  
> - Configure the plugin in **Apps → Synerise → Configuration**.   


1. In the component's `manifest.json` file replace `{YOUR_VENDOR_NAME}` with your current vtex account name.<br/>⚠️ **Note:** This placeholder must be updated in all occurrences throughout the configuration process.

2. Import the `{YOUR_VENDOR_NAME}.synerise-recommendation-slider` app to your theme dependencies in the `manifest.json` file, as follows:

```json
"dependencies": {
  "{YOUR_VENDOR_NAME}.synerise-recommendation-slider": "1.x"
}
```

3. Add the `synerise-recommendations` to your store theme blocks.
   In the example below, the `synerise-recommendations` is added to the `flex-layout.row` block from the `store.product` template:

```json
  "store.product": {
    "children": [
      "flex-layout.row#reco-slider-title",
      "flex-layout.row#reco-slider"
    ]
  },

  "flex-layout.row#reco-slider-title": {
    "children": ["rich-text#reco-slider-title"]
  },
  "rich-text#reco-slider-title": {
    "props": {
      "text": "##### Recommendation Slider"
    }
  },
  "flex-layout.row#reco-slider": {
    "children": ["synerise-recommendations#reco-slider"]
  },
  "synerise-recommendations#reco-slider": {
    "props": {
      "campaignId": "xxxx"
    }
  },
```
### Props
<!-- prettier-ignore-start -->
| Prop name | Type | Description |
| - | - | - |
| `campaignId` | `string` | Campaign ID from Synerise for establishing the context. |
| `items` | `object` | Items per page configuration for different devices. |
| `itemsSource` | `object` | Source of the Item ID or item IDs for the recommendation context. |
| `itemsExcluded` | `string` | Items (identified by itemId in the item feed) that will be excluded from the generated recommendations. For example, items already added to the basket. A comma-separated list of items IDs.  |
| `additionalFilters` | `string` | Additional filters. These are merged with the campaign's own filters according to the logic in filtersJoiner. |
| `filtersJoiner` | `enum` | Defines the logic of merging additionalFilters with the campaign's existing filters. |
| `additionalElasticFilters` | `string` | Additional elastic filters. These are merged with the campaign's own elastic filters according to the logic in elasticFiltersJoiner. |
| `elasticFiltersJoiner` | `enum` | Defines the logic of merging additionalElasticFilters with the campaign's existing elastic filters. |
| `displayAttributes` | `string` | An array of item attributes which value will be returned in a recommendation response. The array will be merged together with the configuration of the recommendation. A comma-separated list of attributes.|
| `includeContextItems` | `boolean` | An array of item attributes which value will be returned in a recommendation response. The array will be merged together with the configuration of the recommendation. |
<!-- prettier-ignore-end -->
