import { Injectable } from '@angular/core'
import { CanLoad, Router } from '@angular/router'
import { AuthService } from './auth.service'
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class CanLoadAdminService implements CanLoad {
    constructor(private af: AngularFireAuth, private router: Router) { }

    async canLoad() {
        const user = await this.af.auth.currentUser;
        if (user) {
            return true
        }
        this.router.navigate(['login'])
        return false
    }
}