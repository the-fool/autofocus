import { createAction, props } from '@ngrx/store'
import { Postcard } from './models';

export const FetchPostcards = createAction(
    '[Postcards] Fetch All',
)

export const FetchPostcardsSucceeded = createAction(
    '[Postcords] Fetch Succeeded',
    props<{postcards: Postcard[]}>()
)

export const FetchPostcardsFailed = createAction(
    '[Session] Fetch Failed'
)
