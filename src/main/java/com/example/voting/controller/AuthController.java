package com.example.voting.controller;

import com.example.voting.jwt.JwtUtils;
import com.example.voting.model.ERole;
import com.example.voting.model.User;
import com.example.voting.payload.request.LoginRequest;
import com.example.voting.payload.request.SignupRequest;
import com.example.voting.payload.response.MessageResponse;
import com.example.voting.payload.response.UserResponse;
import com.example.voting.repositories.RoleRepository;
import com.example.voting.repositories.UserRepository;
import com.example.voting.service.MyUserDetails;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    DaoAuthenticationProvider authenticationProvider;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private void setCookie(Cookie cookie) {
        cookie.setHttpOnly(true);
        cookie.setPath("/");
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList().get(0);

        Cookie cookie = new Cookie("Bearer", jwt);
        setCookie(cookie);
        response.addCookie(cookie);

//TODO: Get a boolean value from the database to check if the user has voted or not
        return ResponseEntity.ok(new UserResponse(
                userDetails.getUsername(),
                userDetails.getEmail(),
                role,
                true));
    }

    @PostMapping("register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest, HttpServletResponse response) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        user.setRole(ERole.ROLE_USER);
        userRepository.save(user);

        String jwt = jwtUtils.generateJwtToken(signUpRequest.getUsername());
        Cookie cookie = new Cookie("Bearer", jwt);
        setCookie(cookie);
        response.addCookie(cookie);

        return ResponseEntity.ok(new UserResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole().toString(),
                true));
    }

    @PostMapping("/registerDelegate")
    public ResponseEntity<?> registeDelegate(@Valid @RequestBody SignupRequest signUpRequest, HttpServletResponse response) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        user.setRole(ERole.ROLE_DELEGATE);
        userRepository.save(user);

        String jwt = jwtUtils.generateJwtToken(signUpRequest.getUsername());
        Cookie cookie = new Cookie("Bearer", jwt);
        setCookie(cookie);
        response.addCookie(cookie);

        return ResponseEntity.ok(new UserResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole().toString(),
                true));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        Cookie cookie = new Cookie("Bearer", null);
        cookie.setMaxAge(0);
        setCookie(cookie);
        response.addCookie(cookie);
        return ResponseEntity.ok(new MessageResponse("User logged out successfully!"));
    }

    @GetMapping("/user")
    public String userAccess() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList().get(0);
        return "User Content: " + username + " " + role;
    }

    @GetMapping("/checkCookie")
    public boolean checkCookie(HttpServletRequest request) {
        String jwt = parseJwt(request);
        return jwt != null && jwtUtils.validateJwtToken(jwt);
    }

    private String parseJwt(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String auth = cookie.getName() + "=" + cookie.getValue() + "; ";
                if (StringUtils.hasText(auth) && auth.startsWith("Bearer=")) {
                    return auth.substring(7);
                }
            }
            return null;
        } else {
            return null;
        }
    }


}
