import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail
} from '@angular/fire/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
  }

  async getSignInMethods(email: string): Promise<string[]> {

  return await fetchSignInMethodsForEmail(
    this.auth,
    email
  );

}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle() {

    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(
      this.auth,
      provider
    );

    const idToken = await result.user.getIdToken();

    return {
      user: result.user,
      idToken
    };
  }

  logout() {
    return signOut(this.auth);
  }

  getUser() {
    return this.auth.currentUser;
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

}
