import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  register(email: string, password: string) {
  return createUserWithEmailAndPassword(
    this.auth,
    email,
    password
  );
}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  return signInWithPopup(
    this.auth,
    provider
  );
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
