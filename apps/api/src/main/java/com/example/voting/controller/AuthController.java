package com.example.voting.controller;

import com.example.voting.jwt.JwtUtils;
import com.example.voting.model.Action;
import com.example.voting.model.ERole;
import com.example.voting.model.User;
import com.example.voting.dto.request.LoginRequest;
import com.example.voting.dto.request.SignupRequest;
import com.example.voting.dto.response.JWTResponse;
import com.example.voting.dto.response.MessageResponse;
import com.example.voting.service.UserService;
import com.example.voting.service.VoteService;
import com.example.voting.service.LogService;
import com.example.voting.utils.Validation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.example.voting.component.MyAuthenticationProvider;
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
    MyAuthenticationProvider authenticationProvider;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    UserService userService;
    @Autowired
    VoteService voteService;
    @Autowired
    LogService logService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);


    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("AuthController - Authenticating user: {}", loginRequest.getUsername());
        if(!Validation.isPasswordValid(loginRequest.getPassword()) || !Validation.isUsernameValid(loginRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Password or Username is not valid!"));
        }
        Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String username = authentication.getName();
        
        var authorities = authentication.getAuthorities();
        logger.info("AuthController - Username: {}, Authorities: {}", username, authorities);
        authorities.forEach(auth -> logger.info("AuthController - Role: {}", auth.getAuthority()));
        String role = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .toList().get(0);
        logger.info("AuthController - Selected role: {}", role);
        
        String jwt = jwtUtils.generateJwtToken(username, role);
        logService.log(username, Action.LOGIN);
        boolean hasVoted;
        if(role.equals(ERole.ROLE_VOTER.toString())) {
            hasVoted = voteService.hasVote(username);
        } else {
            hasVoted = false;
        }

        User user = userService.getUserByUsername(username);
        Boolean isDemoAccount = user != null ? user.getIsDemoAccount() : false;

        return ResponseEntity.ok(new JWTResponse(
                "Bearer " + jwt,
                username,
                user != null ? user.getEmail() : "",
                role,
                hasVoted,
                isDemoAccount));
    }

    @PostMapping("register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if(!Validation.isPasswordValid(signUpRequest.getPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Password is not valid!"));
        }
        if(!Validation.isUsernameValid(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is not valid!"));
        }
        if(!Validation.isEmailValid(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is not valid!"));
        }
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getPassword());
        user.setRole(ERole.ROLE_VOTER);
        try {
            userService.createUser(user);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }

        String jwt = jwtUtils.generateJwtToken(signUpRequest.getUsername(), user.getRole().toString());
        logService.log(user.getUsername(), Action.REGISTER_VOTER);

        User createdUser = userService.getUserByUsername(user.getUsername());
        Boolean isDemoAccount = createdUser != null ? createdUser.getIsDemoAccount() : false;

        return ResponseEntity.ok(new JWTResponse(
                "Bearer " + jwt,
                createdUser != null ? createdUser.getUsername() : user.getUsername(),
                createdUser != null ? createdUser.getEmail() : user.getEmail(),
                user.getRole().toString(),
                false,
                isDemoAccount));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser() {

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


    @GetMapping("/checkAuth")
    public boolean checkAut(HttpServletRequest request) {
        String jwt = parseJwt(request);
        return jwt != null && jwtUtils.validateJwtToken(jwt);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if(StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")){
            return headerAuth.substring(7);
        }
        else return null;
    }



}
