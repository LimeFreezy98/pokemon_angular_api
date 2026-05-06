import { Component } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async loginWithGoogle() {
    try {
    
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);

    const user = result.user;

    if (!user) return;

    console.log('Logged in:', user);

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
        beatenPlayers: [],
        lostToPlayers: [],
        createdAt: new Date()
      });
    
      console.log('New user created in Firestore');
    } else {
      console.log('User already exists');
    }

    // 👉 Navigate AFTER everything is done
    this.router.navigate(['/game-setup']);

  } catch (err) {
    console.error('Login failed:', err);
  }
}
}