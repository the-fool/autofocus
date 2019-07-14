import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMapTo, switchMap } from 'rxjs/operators';
import { PostcardService } from './service';
import * as actions from './actions';

@Injectable()
export class PostcardEffects {
  submitPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.FetchPostcards),
      switchMapTo(
        this.svc.getAll()
          .pipe(
            map(postcards => actions.FetchPostcardsSucceeded({ postcards }))))))

  updatePostcard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.UpdatePostcard),
      switchMap(x =>
        this.svc.update(x.postcard, x.newImage)
          .pipe(
            map(postcard => actions.UpdatePostcardSuccess({ postcard }))))))

  constructor(private actions$: Actions, private svc: PostcardService) {}
}
