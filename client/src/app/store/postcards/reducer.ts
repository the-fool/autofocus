import { Postcard } from './models'
import { createReducer, on } from '@ngrx/store'
import * as actions from './actions'

export interface State {
  thinking: boolean
  postcards: Postcard[]
}

const initialState: State = {
  postcards: [],
  thinking: false
}

export const reducer = createReducer(
  initialState,

  on(actions.FetchPostcardsSucceeded, (state, { postcards }) => ({
    ...state,
    postcards
  })),

  on(actions.UpdatePostcard, state => ({
    ...state,
    thinking: true
  })),

  on(actions.UpdatePostcardSuccess, (state, { postcard }) => ({
    ...state,
    postcards: { ...state.postcards, [postcard.id]: postcard }, // TODO
    thinking: false
  })),

  on(actions.UpdatePostcardFail, state => ({
    ...state,
    thinking: false
  }))
)

export const selectors = {
  collection: (s: State) => s.postcards,
}
