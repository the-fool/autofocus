import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMapTo, switchMap, catchError } from 'rxjs/operators';
import { PostcardService } from './service';
import * as actions from './actions';
import { of } from 'rxjs';
import { PinClicked } from '../map-page/actions';

@Injectable()
export class PostcardEffects {

  createPostcard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.CreatePostcard),
      switchMapTo(
        this.svc.create().pipe(
          switchMap(postcard => [
            actions.UpdatePostcardSuccess({ postcard }),
            PinClicked({ postcard })])))))

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

  deletePostcard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.DeletPostcardClicked),
      switchMap(({ key }) =>
        this.svc.delete(key).pipe(
          map(() => actions.DeletPostcardSuccess({ key })),
          catchError(er => of(actions.DeletePostcardFailure()))))))

  constructor(private actions$: Actions, private svc: PostcardService) { }
}
