import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Postcard } from './models';

const DUMMY: Postcard[] = [
    {
        x: 0.5,
        y: 0.6,
        img: 'wut',
        comment: ''
    },
    {
        x: 0.8,
        y: 0.4,
        img: 'wut',
        comment: ''
    },
    {
        x: 0.2,
        y: 0.2,
        img: 'wut',
        comment: ''
    },
]

@Injectable({
    providedIn: 'root'
})
export class PostcardService {
    getAll() {
        return of(DUMMY)
    }
}
