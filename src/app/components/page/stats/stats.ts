import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  userData: any = null;
  loading = true;

  async ngOnInit() {
    const user = await firstValueFrom(authState(this.auth));

    if (!user) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    const userRef = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      this.userData = snap.data();
    }

    this.loading = false;

    // 🔥 FORCE UI UPDATE (THIS FIXES YOUR ISSUE)
    this.cdr.detectChanges();
  }
}