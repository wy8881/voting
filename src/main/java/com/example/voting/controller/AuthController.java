package com.example.voting.controller;

import com.example.voting.jwt.JwtUtils;
import com.example.voting.model.Action;
import com.example.voting.model.ERole;
import com.example.voting.model.User;
import com.example.voting.payload.request.LoginRequest;
import com.example.voting.payload.request.SignupRequest;
import com.example.voting.payload.response.MessageResponse;
import com.example.voting.payload.response.VoterResponse;
import com.example.voting.service.DBService;
import com.example.voting.service.LogService;
import com.example.voting.service.MyUserDetails;
import com.example.voting.utils.Validation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
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
    PasswordEncoder encoder;
    @Autowired
    DBService dbService;
    @Autowired
    LogService logService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);


    @PostMapping("/test")
    public String test() {
        return "Test Auth";
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        if(!Validation.isPasswordValid(loginRequest.getPassword()) || !Validation.isUsernameValid(loginRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Password or Username is not valid!"));
        }
        Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList().get(0);
        ResponseCookie cookie = ResponseCookie.from("Bearer", jwt)
                .httpOnly(true)
                .path("/")
                .maxAge(60*60)
                .sameSite("Lax")
                .build();
        response.setHeader("Set-Cookie", cookie.toString());
        logService.log(userDetails.getUsername(), Action.LOGIN);
        boolean hasVoted;
        if(role.equals(ERole.ROLE_VOTER.toString())) {
            hasVoted = dbService.hasVote(userDetails.getUsername());
        } else {
            hasVoted = false;
        }

        return ResponseEntity.ok(new VoterResponse(
                userDetails.getUsername(),
                userDetails.getEmail(),
                role,
                hasVoted));
    }

    @PostMapping("register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest, HttpServletResponse response) {
        if(!Validation.isPasswordValid(signUpRequest.getPassword())
                || !Validation.isUsernameValid(signUpRequest.getUsername())
                || !Validation.isEmailValid(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Password, Username or Email is not valid!"));
        }
        if (dbService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (dbService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        user.setRole(ERole.ROLE_VOTER);
        dbService.createUser(user);
        dbService.createVoter(user.getUsername());

        String jwt = jwtUtils.generateJwtToken(signUpRequest.getUsername());
        ResponseCookie cookie = ResponseCookie.from("Bearer", jwt)
                .httpOnly(true)
                .path("/")
                .maxAge(60*60)
                .sameSite("Lax")
                .build();
        response.setHeader("Set-Cookie", cookie.toString());

        logService.log(user.getUsername(), Action.REGISTER_VOTER);

        return ResponseEntity.ok(new VoterResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole().toString(),
                false));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        Cookie cookie = new Cookie("Bearer", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        logService.log(SecurityContextHolder.getContext().getAuthentication().getName(), Action.LOGOUT);

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
