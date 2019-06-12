import { Postcard } from './models'
import { createReducer, on } from '@ngrx/store'
import * as actions from './actions'

export interface State {
  postcards: Postcard[]
}

const initialState: State = {
  postcards: []
}

export const reducer = createReducer(
  initialState,

  on(actions.FetchPostcardsSucceeded, (state, { postcards }) => ({
    ...state,
    postcards
  }))
)

export const selectors = {
    collection: (s: State) => s.postcards,
}
