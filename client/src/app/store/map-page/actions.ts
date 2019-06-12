import { createAction, props } from '@ngrx/store'
import { Postcard } from '../postcards/models';

export const PinClicked = createAction(
    '[Map Page] Pin Clicked',
    props<{postcard: Postcard}>()
)

export const PostcardClosed = createAction(
    '[Map Page] Postcard Closed',
)
