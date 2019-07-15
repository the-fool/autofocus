import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { State } from 'src/app/store'
import { Observable, of, combineLatest } from 'rxjs'
import { Postcard } from '../../store/postcards/models'
import { selectors } from 'src/app/store'
import { FetchPostcards } from 'src/app/store/postcards/actions'
import { map, tap, switchMap } from 'rxjs/operators';
import { PinClicked, PinLocationSet } from 'src/app/store/map-page/actions';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    templateUrl: 'map.html',
    styleUrls: ['map.scss']
})
export class MapComponent implements OnInit {
    postcards: Observable<Postcard[]>
    chosenPostcard: Observable<Postcard>
    authorized: Observable<boolean>
    placingPin: Observable<boolean>

    constructor(private store: Store<State>, private af: AngularFireAuth) { }

    ngOnInit() {
        this.authorized = this.af.authState.pipe(
            switchMap(u => u ? u.getIdToken() : of(false)),
            map(token => !!token))
        this.postcards = this.store.select(selectors.postcards.collection)
        this.chosenPostcard = combineLatest(
            this.store.select(selectors.mapPage.chosenPostcard),
            this.postcards).pipe(map(([id, ps]) =>  ps.find(p => p.id === id)))

        this.placingPin = this.store.select(selectors.mapPage.situation).pipe(map(s => s === 'placing'))
        this.store.dispatch(FetchPostcards())

    }

    select(postcard: Postcard) {
        this.store.dispatch(PinClicked({postcard}))
    }

    doPlacePin(e: MouseEvent) {
        const x = e.clientX / 1920
        const y = e.clientY / 1080
        this.store.dispatch(PinLocationSet({x, y}))
    }
}
