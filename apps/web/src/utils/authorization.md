# Authorization Best Practices

## Defense in Depth Strategy

Since multiple roles share the same Dashboard, we use a **multi-layer authorization approach**:

### 1. **Backend Authorization (Primary Security Layer)**
- ✅ **Always validate on the backend** - Backend is the source of truth
- ✅ Use `@PreAuthorize` annotations on controllers
- ✅ Validate JWT tokens on every request
- ✅ Return 401 (Unauthorized) or 403 (Forbidden) for invalid access

### 2. **Route Protection (Frontend Security Layer)**
- ✅ Use `withRoleAccess` HOC to protect routes
- ✅ Redirect unauthorized users to appropriate pages
- ✅ Prevents users from accessing routes they shouldn't see

### 3. **Component-Level Checks (UX Layer)**
- ✅ Conditionally render UI based on user role
- ✅ Hide buttons/features users can't access
- ⚠️ **Note**: This is for UX only, not security!

### 4. **API Error Handling**
- ✅ Handle 401/403 errors gracefully
- ✅ Redirect to login on authentication failure
- ✅ Show appropriate error messages

## Current Implementation

### Backend (✅ Good)
```java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")  // Class-level protection
public class AdminController {
    // All endpoints require ROLE_ADMIN
}
```

### Frontend Route Protection (✅ Good)
```javascript
export default withRoleAccess(Dashboard, "ROLE_USER");
// Allows any authenticated user (ROLE_VOTER, ROLE_ADMIN, etc.)
```

### Component-Level (✅ Good)
```javascript
{user.role === "ROLE_ADMIN" && (
    // Admin-only UI
)}
```

## Best Practices Checklist

- [x] Backend validates all requests
- [x] Routes are protected with HOC
- [x] UI conditionally renders based on role
- [ ] Global error handling for 401/403 (TODO)
- [ ] Role checking utility hook (TODO)
- [ ] Graceful error messages (TODO)

## Security Principles

1. **Never trust the frontend** - Always validate on backend
2. **Fail securely** - Default to denying access
3. **Principle of least privilege** - Users only see what they need
4. **Defense in depth** - Multiple layers of protection
5. **Clear error messages** - Help users understand what went wrong

