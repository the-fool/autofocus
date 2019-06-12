import { InjectionToken } from '@angular/core'
import {
  ActionReducerMap,
  Action,
  ActionReducer,
  MetaReducer,
  createSelector,
  createFeatureSelector
} from '@ngrx/store'
import * as fromPostcards from './postcards/reducer'
import { environment } from '../../environments/environment'
import { PostcardEffects } from './postcards/effects'

export interface State {
  postcards: fromPostcards.State
}

export const REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root Reducer Token',
  {
    factory: () => ({
      postcards: fromPostcards.reducer
    })
  }
)

export const EFFECTS = [PostcardEffects]

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    const result = reducer(state, action)
    console.groupCollapsed(action.type)
    console.log('prev state', state)
    console.log('action', action)
    console.log('next state', result)
    console.groupEnd()

    return result
  }
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger]
  : []

const selectPostcards = createFeatureSelector<State, fromPostcards.State>(
  'postcards'
)

export const selectors = {
  postcards: {
    collection: createSelector(
      selectPostcards,
      fromPostcards.selectors.collection
    ),
  }
}