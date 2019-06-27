import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { State } from 'src/app/store'
import { Observable, of } from 'rxjs'
import { Postcard } from '../../store/postcards/models'
import { selectors } from 'src/app/store'
import { FetchPostcards } from 'src/app/store/postcards/actions'
import { map, tap, switchMap } from 'rxjs/operators';
import { PinClicked } from 'src/app/store/map-page/actions';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    templateUrl: 'map.html',
    styleUrls: ['map.scss']
})
export class MapComponent implements OnInit {
    postcards: Observable<Postcard[]>
    chosenPostcard: Observable<Postcard>
    authorized: Observable<boolean>
    constructor(private store: Store<State>, private af: AngularFireAuth) { }

    ngOnInit() {
        this.authorized = this.af.authState.pipe(
            switchMap(u => u ? u.getIdToken() : of(false)),
            map(token => !!token))
        this.postcards = this.store.select(selectors.postcards.collection)
        this.chosenPostcard = this.store.select(selectors.mapPage.chosenPostcard)
        this.store.dispatch(FetchPostcards())
    }

    select(postcard: Postcard) {
        this.store.dispatch(PinClicked({postcard}))
    }
}