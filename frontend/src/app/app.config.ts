import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// 🔥 Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
 apiKey: "AIzaSyBJ7ZEX26qbJZVuzk5IoA1B114i3J0_qhA",
  authDomain: "segurentry-app.firebaseapp.com",
  projectId: "segurentry-app",
  storageBucket: "segurentry-app.firebasestorage.app",
  messagingSenderId: "187206406043",
  appId: "1:187206406043:web:fad7ab7406c5ef008c1b3e"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};