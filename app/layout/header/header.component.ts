import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public profileInitial: string = '';
  public userEmail: string = '';
  public role: string = '';
  public pathName: string = "";

  menuItems = [
    { label: 'Sign out', action: 'signOut', isSignOut: true },
  ];

  constructor(private router: Router) {
  }

  /**
   * Initializes component and sets up route tracking
   * @returns {void}
   */
  ngOnInit(): void {
    this.initializeUser();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.pathName = this.router.routerState.snapshot.url
      }
    });
  }

  /**
   * Loads user data from browser's localStorage
   * @returns {void}
   */
  initializeUser(): void {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.userEmail = storedEmail;
      this.profileInitial = storedEmail.charAt(0).toUpperCase();
    } else {
      console.error('No email found in localStorage');
    }
  }

   /**
   * Handles actions from the user menu
   * @param {string} action - The action to perform (currently only 'signOut')
   * @returns {void}
   */
  handleMenuAction(action: string): void {
    if (action == 'signOut') {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
