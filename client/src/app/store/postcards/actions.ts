import { createAction, props } from '@ngrx/store'
import { Postcard } from './models';

export const UpdatePostcard = createAction(
    '[Postcards] Update Postcard',
    props<{postcard: Postcard, newImage: File}>()
)

export const UpdatePostcardSuccess = createAction(
    '[Postcards] Update Postcard Success',
    props<{postcard: Postcard}>()
)

export const UpdatePostcardFail = createAction(
    '[Postcards] Update Postcard Fail',
)

export const FetchPostcards = createAction(
    '[Postcards] Fetch All',
)

export const FetchPostcardsSucceeded = createAction(
    '[Postcords] Fetch Succeeded',
    props<{postcards: {[key: string]: Postcard}}>()
)

export const FetchPostcardsFailed = createAction(
    '[Session] Fetch Failed'
)
