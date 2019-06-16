import { Component, OnInit } from '@angular/core'
import { State } from 'src/app/store'
import { Store } from '@ngrx/store';
import { FetchPostcards } from '../store/postcards/actions';

@Component({
    templateUrl: 'admin.html'
})
export class AdminComponent implements OnInit { 
    constructor(private store: Store<State>) {

    }

    ngOnInit() {
        this.store.dispatch(FetchPostcards())
    }
}
