import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMapTo, switchMap } from 'rxjs/operators';
import * as actions from './actions';
import { UpdatePostcard } from '../postcards/actions';

@Injectable()
export class MapPageEffects {
    submitPin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.PlacePinClicked),
            switchMap(({ postcard }) => this.actions$.pipe(
                ofType(actions.PinLocationSet),
                map(({ x, y }) => ({ ...postcard, x, y })),
                map(newPostcard => UpdatePostcard({ postcard: newPostcard }))
            ))))

    constructor(private actions$: Actions) { }
}