import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import IUser from '../models/user.model';
import { delay, map, filter, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  private redirect = false;

  // The dollar sign stands for identidy properties as obsevables:
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(
    private auth: AngularFireAuth, 
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    );

    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );

    // The ?? operator will check if the value in the left is null or undefined
    // if the value is not empty then the value will be returned, otherwize it will return
    // the value of the right side:
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))// of() is observable that in this case push an empty object.
    ).subscribe(data => {
      this.redirect = data.authOnly ?? false;
    });
  }

  public async createUser(userData: IUser) {
    if(!userData.password) {
      throw new Error("Password not provided!");
    }

    // This function register a new account in firestore:
    const userCredential = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, 
      userData.password as string
    );

    if(!userCredential.user) {
      throw new Error("User can't be found!");
    }

    // This function creates a new collection of users:
    await this.usersCollection.doc(userCredential.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    });

    // This function retrive the profile:
    await userCredential.user.updateProfile({
      displayName: userData.name
    });
  }

  public async logout($event?: Event) {
    if($event) {
      $event.preventDefault();
    }

    await this.auth.signOut();

    if(this.redirect) {
      await this.router.navigateByUrl('/');// Forcing redirection.
    }
  }
}
