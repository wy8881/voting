package com.example.voting.controller;

import com.example.voting.jwt.JwtUtils;
import com.example.voting.model.ERole;
import com.example.voting.model.User;
import com.example.voting.payload.request.SignupRequest;
import com.example.voting.payload.response.MessageResponse;
import com.example.voting.payload.response.UserResponse;
import com.example.voting.repositories.RoleRepository;
import com.example.voting.repositories.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000/", methods = {RequestMethod.GET, RequestMethod.POST}, allowCredentials = "true")
@RestController
@RequestMapping("/register")
public class RegisterController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping()
    public String signup(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                StringBuilder cookieString = new StringBuilder();
                cookieString.append(cookie.getName()).append("=").append(cookie.getValue()).append("; ");
                String auth = cookieString.toString();
                return auth;
            }
            return "no this one";
        } else {
            return "no cookies";
        }
    }

    @PostMapping()
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
        //Todo: user can register as different roles?
        user.setRole(ERole.ROLE_USER);
        userRepository.save(user);

        String jwt = jwtUtils.generateJwtToken(signUpRequest.getUsername());
        Cookie cookie = new Cookie("Bearer", jwt);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        return ResponseEntity.ok(new UserResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole().toString(),
                true));
    }
}
