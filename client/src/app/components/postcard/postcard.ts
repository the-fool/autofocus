import { Component, Input, ElementRef } from '@angular/core'
import { Postcard } from 'src/app/store/postcards/models'
import { Store } from '@ngrx/store'
import { State } from 'src/app/store'
import { PostcardClosed } from 'src/app/store/map-page/actions'
import { AuthService } from 'src/app/auth/auth.service'

@Component({
    selector: 'af-postcard',
    templateUrl: 'postcard.html',
    styleUrls: ['postcard.scss']
})
export class PostcardComponent  {
    @Input() postcard: Postcard = {x: 0, y: 0, comment: '', title: '', img: ''}
    @Input() authorized: boolean
    editing = false
    newImage: File

    constructor(private el: ElementRef, private store: Store<State>, private auth: AuthService) {}

    close() {
        this.store.dispatch(PostcardClosed())
    }

    doEdit() {
        this.editing = true
    }

    doSave() {
        console.log(this.postcard)
        console.log(this.newImage)
        this.editing = false
    }
}
