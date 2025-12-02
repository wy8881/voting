package com.example.voting.controller;

import com.example.voting.model.Action;
import com.example.voting.model.ERole;
import com.example.voting.model.User;
import com.example.voting.dto.request.CreateAccountRequest;
import com.example.voting.dto.response.MessageResponse;
import com.example.voting.service.UserService;
import com.example.voting.service.ElectionService;
import com.example.voting.service.DataInitializationService;
import com.example.voting.service.LogService;
import com.example.voting.utils.Validation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UserService userService;
    
    @Autowired
    private ElectionService electionService;

    @Autowired
    private LogService logService;

    @Autowired
    private DataInitializationService dataInitializationService;

    @GetMapping("/accounts")
    public ResponseEntity<List<User>> getAllAccounts() {
        List<User> accounts = userService.getDelegatesAndLoggers();
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/accounts")
    public ResponseEntity<?> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userService.getUserByUsername(adminUsername);
        
        if (admin != null && Boolean.TRUE.equals(admin.getIsDemoAccount())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Demo accounts cannot create new user accounts!"));
        }

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

        if (userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userService.existsByEmail(request.getEmail())) {
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

        User user = new User(request.getUsername(), request.getEmail(), request.getPassword());
        user.setRole(role);
        userService.createUser(user);

        Action logAction = role == ERole.ROLE_DELEGATE ? Action.REGISTER_DELEGATE : Action.REGISTER_LOGGER;
        logService.log(adminUsername, logAction);

        return ResponseEntity.ok(new MessageResponse(role.getName() + " account created successfully!"));
    }

    @DeleteMapping("/accounts/{username}")
    public ResponseEntity<?> deleteAccount(@PathVariable String username) {
        try {
            userService.deleteUser(username);
            String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            logService.log(adminUsername, Action.DELETE_DELEGATE);
            return ResponseEntity.ok(new MessageResponse("Account deleted successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/startElection")
    public ResponseEntity<?> startElection() {
        if (electionService.isElectionStarted()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Election already started!"));
        }
        electionService.startElection();
        return ResponseEntity.ok(new MessageResponse("Election started successfully!"));
    }

    @PostMapping("/stopElection")
    public ResponseEntity<?> stopElection() {
        if (!electionService.isElectionStarted()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Election not started!"));
        }
        electionService.stopElection();
        return ResponseEntity.ok(new MessageResponse("Election stopped successfully!"));
    }

    @PostMapping("/resetDatabase")
    public ResponseEntity<?> resetDatabase() {
        try {
            String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            
            logger.info("Starting full database reset by admin: {}", adminUsername);
            electionService.deleteAllData();
            logger.info("Deleted all data from database");
            
            dataInitializationService.initializePresetData();
            logger.info("Initialized preset data");
            
            dataInitializationService.initializeFixedAccountsAfterReset();
            logger.info("Initialized fixed accounts");
            
            logger.info("Database reset completed by admin: {}", adminUsername);
            return ResponseEntity.ok(new MessageResponse("Database reset completed successfully!"));
        } catch (Exception e) {
            logger.error("Error resetting database: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error resetting database: " + e.getMessage()));
        }
    }
}
