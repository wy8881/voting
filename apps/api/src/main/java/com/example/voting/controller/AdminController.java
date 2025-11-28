package com.example.voting.controller;

import com.example.voting.model.Action;
import com.example.voting.model.ERole;
import com.example.voting.model.User;
import com.example.voting.payload.request.CreateAccountRequest;
import com.example.voting.payload.response.MessageResponse;
import com.example.voting.service.DBService;
import com.example.voting.service.LogService;
import com.example.voting.utils.Validation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private DBService dbService;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private LogService logService;

    @GetMapping("/accounts")
    public ResponseEntity<List<User>> getAllAccounts() {
        List<User> accounts = dbService.getDelegatesAndLoggers();
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/accounts")
    public ResponseEntity<?> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        if (!Validation.isPasswordValid(request.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Password is not valid!"));
        }
        if (!Validation.isUsernameValid(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is not valid!"));
        }
        if (!Validation.isEmailValid(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is not valid!"));
        }

        if (dbService.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (dbService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already taken!"));
        }

        ERole role;
        try {
            role = ERole.valueOf(request.getRole());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid role!"));
        }

        if (role != ERole.ROLE_DELEGATE && role != ERole.ROLE_LOGGER) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Can only create delegate or logger accounts!"));
        }

        User user = new User(request.getUsername(), request.getEmail(), encoder.encode(request.getPassword()));
        user.setRole(role);
        dbService.createUser(user);

        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        Action logAction = role == ERole.ROLE_DELEGATE ? Action.REGISTER_DELEGATE : Action.REGISTER_LOGGER;
        logService.log(adminUsername, logAction);

        return ResponseEntity.ok(new MessageResponse(role.getName() + " account created successfully!"));
    }

    @DeleteMapping("/accounts/{username}")
    public ResponseEntity<?> deleteAccount(@PathVariable String username) {
        try {
            dbService.deleteUser(username);
            String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            logService.log(adminUsername, Action.DELETE_DELEGATE);
            return ResponseEntity.ok(new MessageResponse("Account deleted successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/startElection")
    public ResponseEntity<?> startElection() {
        if (dbService.isElectionStarted()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Election already started!"));
        }
        dbService.startElection();
        return ResponseEntity.ok(new MessageResponse("Election started successfully!"));
    }

    @PostMapping("/stopElection")
    public ResponseEntity<?> stopElection() {
        if (!dbService.isElectionStarted()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Election not started!"));
        }
        dbService.stopElection();
        return ResponseEntity.ok(new MessageResponse("Election stopped successfully!"));
    }
}

