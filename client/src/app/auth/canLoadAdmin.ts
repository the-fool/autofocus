import { Injectable } from '@angular/core'
import { CanLoad, Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class CanLoadAdminService implements CanLoad {
    constructor(private af: AngularFireAuth, private router: Router) { }

    async canLoad() {
        return new Promise<boolean>((res, rej) => {
            this.af.auth.onAuthStateChanged(user => {
                if (user) {
                    res(!!user)
                } else {
                    this.router.navigate(['login'])
                    res(false)
                }
            })
        })
    }
}
