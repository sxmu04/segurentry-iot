import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { withInterceptors } from '@angular/common/http';


const firebaseConfig = {
  apiKey: "AIzaSyCWz9VC7N4V9l0Fh2eMfYLp4tduWeOziH8",
  authDomain: "segurentry-b16a3.firebaseapp.com",
  projectId: "segurentry-b16a3",
  storageBucket: "segurentry-b16a3.firebasestorage.app",
  messagingSenderId: "921321157085",
  appId: "1:921321157085:web:e59f70dd09ac76a822c634",
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};