import { createAction, props } from '@ngrx/store'
import { Postcard } from './models';

export const UpdatePostcard = createAction(
    '[Postcards] Update Postcard',
    props<{postcard: Postcard, newImage?: File}>()
)

export const CreatePostcard = createAction(
    '[Postcards] Create Postcard'
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

export const DeletPostcardClicked = createAction(
    '[Postcards] Delete clicked',
    props<{key: string}>()
)

export const DeletPostcardSuccess = createAction(
    '[Postcards] Delete Success',
    props<{key: string}>()
)

export const DeletePostcardFailure = createAction(
    '[Postcards] Delete Failure'
)
