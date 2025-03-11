import type { ClientsConfig } from '@vtex/api'
import { Service } from '@vtex/api'

// import { firstRoute } from './resolvers/routes'
// import Mutations from './resolvers/mutations'
import Queries from './resolvers/queries'
import schemaDirectives from './resolvers/directives'
import { Clients } from './clients'

const TIMEOUT_MS = 30000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 3,
      timeout: TIMEOUT_MS,
    },
  },
}

export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: Queries,
      //   Mutation: Mutations,
    },
    schemaDirectives,
  },
  routes: {},
  events: {},
})
