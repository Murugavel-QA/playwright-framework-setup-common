# Feature: User Login

## Description
Registered user should login to the application.

## Preconditions
- User account exists in the system.
- Application is accessible at the configured base URL.

## Test Data
| Field          | Value              |
|----------------|--------------------|
| Valid Email    | user@test.com      |
| Valid Password | password123        |
| Wrong Password | wrongpassword      |
| Invalid Email  | not-an-email       |
| Short Password | abc                |

## Acceptance Criteria

### AC1 – Valid login
- User enters valid email and password
- User clicks the login button
- System redirects user to the dashboard

### AC2 – Invalid password
- User enters a valid email with an incorrect password
- User clicks the login button
- System displays an error message (e.g. "Invalid credentials")

### AC3 – Empty form submission
- User submits the login form without entering any data
- System displays validation messages for required fields

## Edge Cases
- Invalid email format (e.g. `not-an-email`) should be rejected with a validation error
- Password shorter than 8 characters should be rejected
- Whitespace-only credentials should be treated as empty
- SQL injection strings in email/password field should be safely handled
- Browser back button after login should keep the user on the dashboard
