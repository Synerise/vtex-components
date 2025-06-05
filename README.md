# VTEX IO Components

This repository contains a collection of VTEX IO components powered by Synerise AI technology. These components enhance VTEX storefronts with advanced product discovery and recommendation capabilities.

## Available Components

### Synerise Search

A powerful search component that provides instant search results with AI-powered suggestions. This component offers:

- Intelligent autocomplete
- Search-as-you-type functionality
- AI-driven search suggestions
- Rich product previews
- Product recommendations
- Recent searches history
- Popular searches

[Learn more about Search](IO/Search/docs/README.md)

### Synerise Listing

A powerful product listing and search results component that leverages Synerise AI Search capabilities. This component provides:

- Advanced product search and filtering
- Customizable faceted navigation
- AI-powered search results

[Learn more about Listing](IO/Listing/docs/README.md)

### Synerise Recommendation Slider

A product recommendation slider component that uses Synerise AI to display personalized product suggestions.

[Learn more about RecoSlider](IO/RecoSlider/docs/README.md)

## Prerequisites

ℹ️ **Initial requirements**  
To ensure the components work correctly, you must have the `synerise-integration` app installed and have configured the Synerise plugin in VTEX for your workspace.

- Install the `synerise-integration` app by running:
  ```sh
  vtex install synerisepartnerar.synerise-integration
  ```
- Configure the plugin in **Apps → Synerise → Configuration**

## Getting Started

1. Choose the component you want to use
2. Follow the component-specific installation instructions in its README
3. Configure the Synerise plugin in VTEX Admin (Apps → Synerise → Configuration)
4. Update the component's manifest.json with your VTEX account name
5. Add the component to your theme's dependencies
6. Customize components with your needs
