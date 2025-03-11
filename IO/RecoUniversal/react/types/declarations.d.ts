declare module '*.png' {
  const value: any
  export default value
}

declare module '*.css' {
  const value: any
  export default value
}

declare module '*.graphql' {
  import type { DocumentNode } from 'graphql'

  const Schema: DocumentNode

  export = Schema
}
