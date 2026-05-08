import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  
  isLoading = false;
  isCheckingAuth = true;
  currentUser: any = null;
  errorMessage: string = '';

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  public router = inject(Router);
  private ngZone = inject(NgZone);

  constructor() {
    console.log('🔧 Login component constructor');
  }

  ngOnInit() {
    console.log('🚀 Login component ngOnInit started');

    // Set up auth state listener FIRST - wrap the callback in ngZone
    onAuthStateChanged(this.auth, (user) => {
      this.ngZone.run(async () => {
      console.log('� Auth state changed:', user ? user.email : 'No user');

      this.isCheckingAuth = false;

      if (user) {
        console.log('✅ User authenticated:', user.displayName);
        console.log('📧 Email:', user.email);
        this.currentUser = user;
        
        // Check if this is a new sign-in
        const isNewSignIn = sessionStorage.getItem('signingIn');
        if (isNewSignIn === 'true') {
          console.log('🎉 New sign-in detected, saving to Firestore...');
          sessionStorage.removeItem('signingIn');
          await this.saveUserToFirestore(user);
        }
      } else {
        console.log('❌ No user authenticated');
        this.currentUser = null;
      }
      });
    });
  }

  async loginWithGoogle() {
    if (this.isLoading) {
      console.log('⏳ Already loading, ignoring click');
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      console.log('🚀 Starting Google login with popup...');
      
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log('📤 Opening sign-in popup...');

      // Mark that we're signing in
      sessionStorage.setItem('signingIn', 'true');

      // Use popup instead of redirect
      const result = await signInWithPopup(this.auth, provider);

      console.log('✅ Sign-in successful!', result.user.email);
      
      // Save user to Firestore
      await this.saveUserToFirestore(result.user);

    } catch (err: any) {
      this.isLoading = false;
      sessionStorage.removeItem('signingIn');
      console.error('❌ Login failed:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      this.errorMessage = err.message;
      
      // Show user-friendly error messages
      if (err.code === 'auth/popup-blocked') {
        alert('Popup was blocked. Please allow popups for this site and try again.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        console.log('User closed the popup');
      } else {
        alert(`Login failed: ${err.message}`);
      }
    }
  }

  private async saveUserToFirestore(user: User) {
    try {
      if (!user) {
        console.error('❌ No user information provided to save.');
        return;
      }

      this.isLoading = true;
      console.log('📥 Saving user to Firestore:', user.uid);

      const userRef = doc(this.firestore, `users/${user.uid}`);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log('➕ Creating new user...');
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || 'Anonymous',
          email: user.email || '',
          photoURL: user.photoURL || '',
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          beatenPlayers: [],
          lostToPlayers: [],
          createdAt: new Date()
        });
        console.log('✅ New user created in Firestore');
      } else {
        console.log('✅ User already exists in Firestore');
      }

      this.isLoading = false;
      console.log('🎮 Navigating to game setup...');
      await this.router.navigate(['/setup']);
      console.log('✅ Navigation complete');

    } catch (err: any) {
      console.error('❌ Firestore save failed:', err);
      console.error('Error details:', err);
      
      // If it's an offline error, still navigate to the game
      if (err.code === 'unavailable' || err.message?.includes('offline')) {
        console.warn('⚠️ Firestore offline - continuing to game anyway');
        this.isLoading = false;
        await this.router.navigate(['/setup']);
        return;
      }
      
      this.errorMessage = `Failed to save user data: ${err.message}`;
      this.isLoading = false;
      
      // Still navigate even if save failed
      console.log('⚠️ Navigating to game despite Firestore error');
      await this.router.navigate(['/setup']);
    }
  }
}

 