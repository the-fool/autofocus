import { Injectable } from '@angular/core'
import { Postcard } from './models'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid'

const url = environment.postcardApiUrl + '/postcards'

@Injectable({
    providedIn: 'root'
})
export class PostcardService {
    constructor(private http: HttpClient) {}
    getAll(): Observable<{[key: string]: Postcard}> {
        return this.http.get<Postcard[]>(url)
            .pipe(map(xs => xs.reduce((ac, x) => ({...ac, [x.id]: x}), {})))
    }

    delete(key: string) {
        return this.http.delete(url + `/${key}`)
    }

    create() {
        const id = uuid()
        const newPostcard: Postcard = {
            id,
            x: 0.5,
            y: 0.5,
            title: '',
            comment: '',
            img: ''
        }
        return this.update(newPostcard, null)
    }

    update(postcard: Postcard, newImage: File | null) {
        const fd = new FormData()
        if (newImage) {
            fd.append('file', newImage, newImage.name)
        }
        fd.append('id', postcard.id)
        fd.append('x', `${postcard.x}`)
        fd.append('y', `${postcard.y}`)
        fd.append('comment', postcard.comment)
        fd.append('title', postcard.title)
        fd.append('img', postcard.img)

        return this.http.post<Postcard>(url, fd)
    }
}
