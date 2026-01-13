import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthenticationService } from '@core/services/auth.service'

/**
 * Guard that protects routes - allows only logged-in users
 * Works for both admin and employee users
 */
export const authProtectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthenticationService)

  if (authService.isLoggedIn() || authService.isEmployeeLoggedIn()) {
    return true
  } else {
    router.navigate(['/auth/sign-in'])
    return false
  }
}

/**
 * Guard that prevents logged-in users from accessing auth pages
 * Redirects logged-in users to dashboard
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthenticationService)

  if (authService.isLoggedIn() || authService.isEmployeeLoggedIn()) {
    router.navigate(['/dashboards'])
    return false
  } else {
    return true
  }
}

/**
 * Guard for protected routes - allows both admin and employee users
 * Replaced admin-only restriction to support both user types
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthenticationService)

  // Check if either admin or employee is logged in
  if (authService.isLoggedIn() || authService.isEmployeeLoggedIn()) {
    return true
  } else {
    router.navigate(['/auth/sign-in'])
    return false
  }
}
