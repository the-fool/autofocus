import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Postcard } from './models';

const DUMMY: Postcard[] = [
    {
        title: 'Lake of Diana',
        x: 0.5,
        y: 0.6,
        img: '/assets/diana.jpg',
        comment: 'It lies in a small crater-like hollow on the mountainside'
    },
    {
        title: 'Brahmapura',
        x: 0.8,
        y: 0.4,
        img: '/assets/brahmapura.jpg',
        comment: 'Brahmapura is a planet composed entirely of Brahman, considered superior to svarga and is full of eternity, knowledge and bliss, the planet of the Bhagavān.'
    },
    {
        title: 'Starbucks',
        x: 0.2,
        y: 0.2,
        img: '/assets/starbucks.jpg',
        comment: 'Fast & Reliable'
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
