# Feature: Checkout

## Description
Registered and guest users should be able to complete a purchase through the checkout flow.

## Preconditions
- At least one product has been added to the shopping cart.
- User is either logged in or proceeding as a guest.
- Payment gateway sandbox is active.

## Test Data
| Field            | Value                        |
|------------------|------------------------------|
| Valid Card       | 4111 1111 1111 1111          |
| Card Expiry      | 12/28 (MM/YY)                |
| CVV              | 123                          |
| Billing Name     | Test User                    |
| Billing Address  | 123 Test Street, Test City   |
| Invalid Card     | 0000 0000 0000 0000          |
| Expired Expiry   | 01/20                        |

## Acceptance Criteria

### AC1 – Successful checkout (logged-in user)
- Logged-in user proceeds to checkout with items in cart
- User enters valid shipping and payment details
- System processes the order and displays an order confirmation page with an order number

### AC2 – Failed payment
- User enters invalid card details
- System displays a payment failure error message
- Cart contents are preserved after the failure

### AC3 – Guest checkout
- Guest user proceeds to checkout
- User fills in email, shipping, and payment details
- System creates the order and sends a confirmation email to the provided address

### AC4 – Empty cart
- User navigates directly to the checkout page with an empty cart
- System redirects the user back to the products page with an informational message

## Edge Cases
- Applying an invalid or expired coupon code should display an appropriate error
- Removing the last item from the cart during checkout should redirect back to the shop
- Submitting checkout with missing required fields should show per-field validation errors
- Refreshing the payment page mid-checkout should not duplicate the order
- Very long shipping address strings should be handled gracefully
