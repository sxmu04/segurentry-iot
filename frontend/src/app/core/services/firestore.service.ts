import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collectionData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private path = 'usuarios';

  constructor(private firestore: Firestore) {}

  // 📥 Leer en tiempo real
  getUsers(): Observable<any[]> {
    const ref = collection(this.firestore, this.path);
    return collectionData(ref, { idField: 'id' });
  }

  // ➕ Crear
  createUser(data: any) {
    const ref = collection(this.firestore, this.path);
    return addDoc(ref, data);
  }

  // ✏️ Actualizar
  updateUser(id: string, data: any) {
    const ref = doc(this.firestore, `${this.path}/${id}`);
    return updateDoc(ref, data);
  }

  // 🗑️ Eliminar
  deleteUser(id: string) {
    const ref = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(ref);
  }
}