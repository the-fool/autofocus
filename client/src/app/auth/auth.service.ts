import { Injectable, NgZone } from '@angular/core'

declare const firebase

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private zone: NgZone) { }

    get auth() {
        return firebase.auth()
    }

    get user() {
        return this.auth.currentUser
    }

    get isAuthorized() {
        return this.user !== null
    }

    async getToken(): Promise<string> {
        if (this.isAuthorized) {
            return firebase.auth().currentUser.getIdToken()
        }
        const authResult = await this.authorize()
        return authResult.credential.idToken
    }

    private async authorize() {
        if (this.isAuthorized) {
            return
        }
        const googleProvider = new firebase.auth.GoogleAuthProvider()
        return firebase.auth().signInWithRedirect(googleProvider)
    }
}