import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { State } from 'src/app/store'
import { Observable } from 'rxjs'
import { Postcard } from '../../store/postcards/models'
import { selectors } from 'src/app/store'
import { FetchPostcards } from 'src/app/store/postcards/actions'
import { map } from 'rxjs/operators';
import { PinClicked } from 'src/app/store/map-page/actions';

const height = 800
const width = 1200

@Component({
    templateUrl: 'map.html',
    styleUrls: ['map.scss']
})
export class MapComponent implements OnInit {
    postcards: Observable<Postcard[]>

    constructor(private store: Store<State>) { }

    ngOnInit() {
        this.postcards = this.store.select(selectors.postcards.collection)
        .pipe(map(ps => ps.map(p => ({
            ...p,
            x: p.x * width,
            y: p.y * height
        }))))
        this.store.dispatch(FetchPostcards())
    }

    select(postcard: Postcard) {
        this.store.dispatch(PinClicked({postcard}))
    }
}