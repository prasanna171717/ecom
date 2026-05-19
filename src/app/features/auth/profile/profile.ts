import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../auth';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  authService = inject(Auth);
  private fb = inject(FormBuilder);

  success = signal('');
  error = signal('');
  loading = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: [{ value: '', disabled: true }]
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);

    this.authService.getProfile().subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          email: user.email
        });

        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to load profile');
      }
    });
  }

  updateProfile() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.success.set('');
    this.error.set('');

    this.authService.updateProfile({
      name: this.form.getRawValue().name!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Profile updated successfully');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Profile update failed');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}