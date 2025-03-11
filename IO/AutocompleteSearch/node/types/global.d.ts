import {
  EventContext,
  ParamsContext,
  RecorderState,
  ServiceContext,
} from '@vtex/api'
import { Clients } from '../clients'

declare global {
  interface State extends RecordState {}

  type Context = ServiceContext<Clients, State, ParamsContext>
  type EventsContext = EventContext<Clients, State>
}
