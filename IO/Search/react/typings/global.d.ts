declare const SyneriseTC: {
  uuid: string
}

declare const SR: {
  event: {
    itemSearchClick: (args: Record<string, unknown>) => Record<string, unknown>
    recommendationView: (
      args: Record<string, unknown>
    ) => Record<string, unknown>
  }
}
