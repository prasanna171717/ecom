import { Component, computed, Inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './shared/components/navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatToolbarModule,MatButtonModule,MatIconModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ecomApp');

  //auth state signal
  private token = signal<string |null>(null);

  //Derived signal
  isLoggedIn = computed(() => !!this.token());

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object){
    this.refreshAuthState();
  }

  logout(){
    if(isPlatformBrowser(this.platformId)){
    localStorage.removeItem('token');
    }
    this.token.set(null);
    this.router.navigate(['/login']);
  }
  refreshAuthState(){
    if(isPlatformBrowser(this.platformId)){
    this.token.set(localStorage.getItem('token'));
    }
  }
}
