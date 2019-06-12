import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMapTo } from 'rxjs/operators';
import * as actions from './actions';
import { PostcardService } from './service';

@Injectable()
export class PostcardEffects {
  submitPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.FetchPostcards),
      switchMapTo(
        this.svc.getAll()
          .pipe(
            map(postcards => actions.FetchPostcardsSucceeded({ postcards }))
          )
      )
    )
  )

  constructor(private actions$: Actions, private svc: PostcardService) {}
}
