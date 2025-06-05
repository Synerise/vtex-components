# Synerise Search Autocomplete

![Search Autocomplete](https://cdn.jsdelivr.net/gh/Synerise/vtex-components@main/IO/Search/docs/search-img.png)
The `synerise-search` is a VTEX IO component that provides an intelligent search box with autocomplete, suggestions, and AI-powered product recommendations.

## Features

- Real-time search suggestions
- Product recommendations
- Recent searches history
- Popular searches
- Customizable debounce time
- Responsive dropdown
- AI-powered relevance

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

2. Import the `{YOUR_VENDOR_NAME}.synerise-search` app to your theme dependencies in the `manifest.json` file, as follows:

```json
"dependencies": {
  "{YOUR_VENDOR_NAME}.synerise-search": "0.x"
}
```

3. Add the `synerise-search` to your store theme blocks. For example, to add it to a header-row block:

```json
{
  "header-row": {
    "children": ["flex-layout.col#search"]
  },

  "flex-layout.col#search": {
    "props": {
      "verticalAlign": "middle"
    },
    "children": ["synerise-search#search"]
  },

  "synerise-search#search": {
    "props": {
      "indexId": "XXXX-XXXX-XXXX",
      "suggestionsIndexId": "YYYY-YYYY-YYYY"
    }
  }
}
```

⚠️ **Note:** While the configuration (`indexId`, `suggestionsIndexId`, and other props) can be defined in JSON, you can also use the VTEX Admin Site Editor interface for easier management.

## Props

<!-- prettier-ignore-start -->
| Prop name | Type | Description | Default |
| - | - | - | - |
| `indexId` | `string` | ID of the Synerise search index containing product data | Required |
| `suggestionsIndexId` | `string` | ID of the index used for search suggestions | `""` |
| `suggestionsLimit` | `number` | Maximum number of search suggestions to show | `5` |
| `recommendations` | `object` | Configuration for product recommendations | See below |
| `inputDebounceTime` | `number` | Delay before triggering search (ms) | `300` |
| `showRecentSearches` | `boolean` | Show recent search history | `true` |
| `recentSearchesLimit` | `number` | Maximum number of recent searches | `5` |
| `showPopularSearches` | `boolean` | Show popular search terms | `true` |
| `popularSearchesLimit` | `number` | Maximum number of popular searches | `5` |
<!-- prettier-ignore-end -->

### Recommendations Configuration

```json
{
  "recommendationIdNoResults": "ZZZZ-ZZZZ-ZZZZ",
  "recommendationHeadingNoResults": "No matches found. You might like these instead:",
  "recommendationIdNoQuery": "WWWW-WWWW-WWWW",
  "recommendationHeadingNoQuery": "Recommended for you"
}
```

#### Recommendations Properties

- `recommendationIdNoResults`: Campaign ID for showing alternative products when search returns no results
- `recommendationHeadingNoResults`: Heading shown above no-results recommendations
- `recommendationIdNoQuery`: Campaign ID for showing default products when search box is empty
- `recommendationHeadingNoQuery`: Heading shown above empty-query recommendations
