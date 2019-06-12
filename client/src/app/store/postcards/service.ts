import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Postcard } from './models';

const DUMMY: Postcard[] = [
    {
        x: 10,
        y: 34,
        img: 'wut',
        comment: ''
    },
    {
        x: 100,
        y: 34,
        img: 'wut',
        comment: ''
    },
    {
        x: 20,
        y: 134,
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
