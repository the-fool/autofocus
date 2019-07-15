import { MapPage } from './models'
import { createReducer, on } from '@ngrx/store'
import * as actions from './actions'

export interface State extends MapPage {}

const initialState: State = {
  selectedPostcard: null,
  situation: 'normal'
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
  })),

  on(actions.PlacePinClicked, state => ({
    ...state,
    situation: 'placing'
  })),

  on(actions.PinLocationSet, state => ({
    ...state,
    situation: 'normal'
  }))
)

export const selectors = {
    selectedPostcard: (s: State) => s.selectedPostcard,
    situation: (s: State) => s.situation
}
