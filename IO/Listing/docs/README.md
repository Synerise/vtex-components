# Synerise Listing

![Products listing](https://cdn.jsdelivr.net/gh/Synerise/vtex-components@main/IO/Listing/docs/listing-img.png)
The `synerise-listing` is a VTEX IO component that provides product listing and search results functionality powered by Synerise AI Search.

## Features

- Product search and listing powered by Synerise AI
- Customizable filters (categories, price ranges, attributes)
- Sorting options (relevance, name, price)
- Pagination
- Responsive design
- Product personalization
- Synerise events handling

## Configuration

> ℹ️ **Initial requirements**  
> To ensure the component works correctly, you must have the `synerise-integration` app installed and have configured the Synerise plugin in VTEX for your workspace.
>
> - Install the `synerise-integration` app by running:
>   ```sh
>   vtex install synerisepartnerar.synerise-integration
>   ```
> - Configure the plugin in **Apps → Synerise → Configuration**.

1. In the component's `manifest.json` file replace `{YOUR_VENDOR_NAME}` with your current vtex account name.<br/>⚠️ **Note:** This placeholder must be updated in all occurrences throughout the configuration process.

2. Import the `{YOUR_VENDOR_NAME}.synerise-listing` app to your theme dependencies in the `manifest.json` file, as follows:

```json
"dependencies": {
  "{YOUR_VENDOR_NAME}.synerise-listing": "0.x"
}
```

3. Add the `synerise-listing` to your store theme blocks. For example, to add it to a category page:

```json
{
  "store.custom#listing": {
    "children": ["flex-layout.row#listing"]
  },
  "flex-layout.row#listing": {
    "children": ["synerise-listing#listing"]
  },
  "synerise-listing#listing": {
    "props": {
      "indexId": "XXXX-XXXX-XXXX"
    }
  }
}
```

4. Replace the default search blocks with `synerise-listing` in your store's `search.json` file:

```json
{
  "store.search": {
    "blocks": ["flex-layout.row#listing"]
  },

  "store.search#brand": {
    "blocks": ["flex-layout.row#listing"]
  },

  "store.search#department": {
    "blocks": ["flex-layout.row#listing"]
  },

  "store.search#category": {
    "blocks": ["flex-layout.row#listing"]
  },

  "store.search#subcategory": {
    "blocks": ["flex-layout.row#listing"]
  },

  "flex-layout.row#listing": {
    "children": ["synerise-listing#listing"]
  },
  "synerise-listing#listing": {
    "props": {
      "indexId": "XXXX-XXXX-XXXX"
    }
  }
}
```

⚠️ **Note:** While the `indexId` and other props can be defined here in the JSON configuration, they can also be configured through the VTEX Admin Site Editor interface.

## Props

<!-- prettier-ignore-start -->
| Prop name | Type | Description | Default |
| - | - | - | - |
| `indexId` | `string` | ID of the Synerise index to be used | Required |
| `personalize` | `boolean` | Enable/disable personalized results | `true` |
| `sortByMetric` | `enum` | Metric for sorting results | `"TransactionsPopularity"` \| `"PageVisitsPopularity"` |
| `listingFilterAttribute` | `string` | Attribute used for automatic filtering based on URL path segments | `"category"` |
| `filterableFacets` | `array` | Configuration of available filters | See below: **Default Filterable Facets** |
| `facetsSize` | `number` | Number of items for facets aggregation [1-10000] | `2000` |
| `maxValuesPerFacet` | `number` | Maximum values per facet [1-1000] | `50` |
| `distinctFilter` | `object` | Configuration for distinct filtering | Optional |
| `ignoreQueryRules` | `boolean` | Disable query rules | `false` |
<!-- prettier-ignore-end -->

### Default Filterable Facets

```json
[
  {
    "key": "category",
    "title": "Category",
    "type": "tree"
  },
  {
    "key": "salePrice.value",
    "title": "Price",
    "type": "price"
  },
  {
    "key": "brand",
    "title": "Brand",
    "type": "list"
  }
]
```

#### Filter Key

The `key` field specifies the attribute name in your Synerise catalog data that will be used for filtering. This should match exactly the field name in your Synerise feed. For example:

- `category` for category filtering
- `salePrice.value` for price filtering
- `brand` for brand filtering

#### Filter Title

The `title` field defines the display name of the filter that will be shown to users in the interface. This can be any user-friendly text that describes the filter. For example:

- "Category" for category navigation
- "Price" for price filters
- "Brand" for brand filtering

#### Filter Type

The `type` field determines how the filter will be displayed in the interface. The component supports three types of filters:

- `tree`: Hierarchical structure (e.g., categories)
- `price`: Range selector with min/max values
- `list`: Simple checkbox list (e.g., brands)

#### Filter Config Editor Title

The optional `__editorItemTitle` field defines the configuration title that appears in the VTEX Admin interface when editing the component settings. If not specified, the `Filter item` value will be used instead.

## Synerise events

#### Automatically handled by Synerise API

- `item.search` - Triggered when a search is performed.

#### Manually added to component's frontend code

- `item.search.click` – Triggered when a user clicks a product in the listing. [See implementation](/IO/Listing/react/components/ItemsList/Item/Item.tsx#L24)
