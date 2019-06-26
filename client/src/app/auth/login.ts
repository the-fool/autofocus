import { AngularFireAuth } from '@angular/fire/auth'
import { Component } from '@angular/core'
import { auth } from 'firebase/app'
import { Router } from '@angular/router';

@Component({
    template: `
    <div>
      <p>Please login.</p>
      <button (click)="login()">Login with Google</button>
    </div>
    `
})
export class LoginComponent {
    constructor(public afAuth: AngularFireAuth, public router: Router) { }

    async login() {
        await this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL).then(async () => {

            const creds = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
            console.log(creds.credential.toJSON());
            this.router.navigate(['admin'])
        })
    }
}