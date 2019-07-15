import { AngularFireAuth } from '@angular/fire/auth'
import { Component } from '@angular/core'
import { auth } from 'firebase/app'
import { Router } from '@angular/router';

@Component({
    template: `
    <div id="login">
      <a href="#" (click)="login()">Click here to login</a>
    </div>
    `,
    styleUrls: ['style.scss']
})
export class LoginComponent {
    constructor(public afAuth: AngularFireAuth, public router: Router) { }

    login() {
        this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL)
            .then(() => this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()))
            .then(creds => {
                console.log(creds)
                this.router.navigate(['map'])
            });
    }
}
