import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  date: any = new Date();
  isLoading: boolean = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      role: ['', Validators.required],
    });
  }

  constructor(public fb: FormBuilder, private router: Router, private authService: AuthService, private toastr: ToastrService) { }

   /**
   * Getter for login form controls
   * @returns {Object} The controls of the login form
   */
  get loginFormControl() {
    return this.loginForm.controls;
  }

  /**
   * Handles input change event by removing whitespace from the input value
   * @param {Event} event - The input change event
   * @returns {void}
   */
  onInputChange(event: any) {
    const input = event.target;
    input.value = input.value.replace(/\s/g, '');
  }

  /**
   * Gets the current year
   * @returns {number} The current year
   */
  getyear() {
    let year = new Date()
    return year.getFullYear()
  }

  /**
   * Handles user login process
   * - Validates the form
   * - Navigates to layout on success
   * - Shows error messages on failure
   * @returns {void}
   */

 onUserLogin() {
    this.isSubmitted = true;

    const email = this.loginFormControl['email'].value.toLowerCase();
    if (email == '' || this.loginFormControl['email'].errors) {
      return;
    }
    else {
      this.isLoading = true;
      const payload = {
        email_id: email
      };

      this.authService.authenticateUser(payload).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response?.access_token) {
            localStorage.setItem('email', email);
            localStorage.setItem('bearer_token', response.access_token);
            this.router.navigate(['/layout']);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          if (error?.status === 401) {
            if (error.error.message) {
              this.toastr.error(error.error.message);
            } 
            return;
          }
          const errorMessage = 'Login failed';
          this.toastr.error(errorMessage);
        }
      });
    }
  }
}
