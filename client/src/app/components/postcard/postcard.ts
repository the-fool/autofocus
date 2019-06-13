import { Component, OnChanges, Input, ElementRef } from "@angular/core";
import { Postcard } from 'src/app/store/postcards/models';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store';
import { PostcardClosed } from 'src/app/store/map-page/actions';

@Component({
    selector: 'postcard',
    templateUrl: 'postcard.html',
    styleUrls: ['postcard.scss']
})
export class PostcardComponent implements OnChanges {
    @Input() postcard: Postcard;
    constructor(private el: ElementRef, private store: Store<State>) {
    }
    ngOnChanges() {
        if (this.postcard) {
            this.el.nativeElement.style.display = 'block'
        } else {
            this.el.nativeElement.style.display = 'none'
        }
    }

    close() {
        this.store.dispatch(PostcardClosed())
    }
}
