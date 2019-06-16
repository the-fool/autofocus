// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpInterceptor
} from '@angular/common/http';
import { from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public afAuth: AngularFireAuth) { }
    intercept = (request: HttpRequest<any>, next: HttpHandler) =>
        !this.afAuth.auth.currentUser ?
        next.handle(request) :
        from(this.afAuth.auth.currentUser.getIdToken()).pipe(
            mergeMap(token => {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return next.handle(request);
            }))
}
