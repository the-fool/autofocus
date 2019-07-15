import { Component, Input, ElementRef } from '@angular/core'
import { Postcard } from 'src/app/store/postcards/models'
import { Store } from '@ngrx/store'
import { State } from 'src/app/store'
import { PostcardClosed } from 'src/app/store/map-page/actions'
import { AuthService } from 'src/app/auth/auth.service'
import { UpdatePostcard, UpdatePostcardSuccess } from 'src/app/store/postcards/actions';
import { PostcardService } from 'src/app/store/postcards/service';

@Component({
    selector: 'af-postcard',
    templateUrl: 'postcard.html',
    styleUrls: ['postcard.scss']
})
export class PostcardComponent {
    @Input() postcard: Postcard = { x: 0, y: 0, comment: '', title: '', img: '', id: '' }
    @Input() authorized: boolean
    editing = false
    thinking = false
    newImage: File

    constructor(private el: ElementRef, private store: Store<State>, private auth: AuthService, private pSvc: PostcardService) { }

    close() {
        this.store.dispatch(PostcardClosed())
    }

    doEdit() {
        this.editing = true
    }

    handleFileChange(fs: FileList) {
        this.newImage = fs.item(0)
    }

    doSave() {
        console.log(this.postcard)
        console.log(this.newImage)
        const payload = {
            postcard: this.postcard,
            newImage: this.newImage
        }
        this.thinking = true
        this.pSvc.update(payload.postcard, payload.newImage).subscribe(postcard => {
            this.store.dispatch(UpdatePostcardSuccess({ postcard }))
            this.thinking = false
        })
        this.editing = false
    }
}
