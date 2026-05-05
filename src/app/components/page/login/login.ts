import { Component } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';



@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);

    const user = result.user;

    if (!user) return;

    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userRef);


    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        createdAt: new Date()
      });

      console.log('New user created in Firestore');
    } else {
      console.log('User already exists');
    }

    console.log('Logged in:', user);
  }
}
