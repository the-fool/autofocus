import { MapPage } from './models'
import { createReducer, on } from '@ngrx/store'
import * as actions from './actions'

export interface State extends MapPage {}

const initialState: State = {
  selectedPostcard: null
}

export const reducer = createReducer(
  initialState,

  on(actions.PinClicked, (state, { postcard }) => ({
    ...state,
    selectedPostcard: postcard.id
  })),

  on(actions.PostcardClosed, (state) => ({
    ...state,
    selectedPostcard: null
  }))
)

export const selectors = {
    selectedPostcard: (s: State) => s.selectedPostcard,
}
