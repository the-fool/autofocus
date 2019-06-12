import { Component, OnChanges, Input, ElementRef } from "@angular/core";
import { Postcard } from 'src/app/store/postcards/models';

@Component({
    selector: 'postcard',
    templateUrl: 'postcard.html',
    styleUrls: ['postcard.scss']
})
export class PostcardComponent implements OnChanges {
    @Input() postcard: Postcard;
    constructor(private el: ElementRef) {
    }
    ngOnChanges() {
        console.log('here')
        console.log(this.postcard);
        if (this.postcard) {
            this.el.nativeElement.style.display = 'block'
        } else {
            this.el.nativeElement.style.display = 'none'
        }
    }
}
