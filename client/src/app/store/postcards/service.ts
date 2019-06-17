import { Injectable } from '@angular/core'
import { Postcard } from './models'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class PostcardService {
    constructor(private http: HttpClient) {}
    getAll() {
        return this.http.get<Postcard[]>(environment.postcardApiUrl + '/postcards')
    }
}
