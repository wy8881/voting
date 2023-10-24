package com.example.voting.controller;

import com.example.voting.jwt.AuthEntryPointJwt;
import com.example.voting.payload.request.LoginRequest;
import com.example.voting.payload.response.UserResponse;
import com.example.voting.service.MyUserDetails;
import jakarta.servlet.http.Cookie;
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
import org.springframework.web.bind.annotation.*;
import com.example.voting.jwt.JwtUtils;

@CrossOrigin(origins = "http://localhost:3000/", methods = {RequestMethod.GET, RequestMethod.POST}, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth/login")
public class LoginController {

    @Autowired
    DaoAuthenticationProvider authenticationProvider;

    @Autowired
    JwtUtils jwtUtils;

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @GetMapping
    public String login() {
        return "login";
    }

//    @PostMapping
//    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
//        logger.info("Login request: {}", loginRequest.getUsername() + " " + loginRequest.getPassword());
//
//        Authentication authentication = authenticationProvider.authenticate(
//                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        String jwt = jwtUtils.generateJwtToken(authentication);
//
//        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
//        String role = userDetails.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .toList().get(0);
//
//        return ResponseEntity.ok(new JwtResponse(jwt,
//                userDetails.getUsername(),
//                userDetails.getEmail(),
//                role));
//    }

    @PostMapping
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
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

//TODO: Get a boolean value from the database to check if the user has voted or not
        return ResponseEntity.ok(new UserResponse(
                userDetails.getUsername(),
                userDetails.getEmail(),
                role,
                true));
    }
}
