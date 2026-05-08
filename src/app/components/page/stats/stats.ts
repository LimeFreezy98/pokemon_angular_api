import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats implements OnInit {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  userData: any = null;
  loading = true;
  errorMessage = '';

  async ngOnInit() {
    try {
      console.log('📊 Loading stats...');
      const user = await firstValueFrom(authState(this.auth));

      if (!user) {
        console.log('❌ No user logged in');
        this.errorMessage = 'Please log in to view your stats';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      console.log('✅ User logged in:', user.uid);

      const userRef = doc(this.firestore, `users/${user.uid}`);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        this.userData = snap.data();
        console.log('✅ User data loaded:', this.userData);
      } else {
        console.log('⚠️ No user data found in Firestore');
        this.errorMessage = 'No stats available yet. Play some games!';
      }

      this.loading = false;
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('❌ Error loading stats:', error);
      this.errorMessage = `Error: ${error.message}. Check your Firebase configuration.`;
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}