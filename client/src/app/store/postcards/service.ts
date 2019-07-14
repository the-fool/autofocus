import { Injectable } from '@angular/core'
import { Postcard } from './models'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

const url = environment.postcardApiUrl + '/postcards'

@Injectable({
    providedIn: 'root'
})
export class PostcardService {
    constructor(private http: HttpClient) {}
    getAll() {
        return this.http.get<Postcard[]>(url)
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

        return this.http.post<Postcard>(url, fd)
    }
}
