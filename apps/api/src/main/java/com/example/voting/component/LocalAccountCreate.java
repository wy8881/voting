package com.example.voting.component;

import com.example.voting.model.Action;
import com.example.voting.model.ERole;
import com.example.voting.model.User;
import com.example.voting.service.UserService;
import com.example.voting.service.LogService;
import com.example.voting.utils.Validation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.Console;
import java.util.Arrays;
import java.util.List;

import static java.lang.System.exit;

@Component
public class LocalAccountCreate implements CommandLineRunner {
    @Autowired
    private UserService userService;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    LogService logService;

    @Override
    public void run(String... args) throws Exception {
        List<String> command = Arrays.asList(args);
        if(!command.isEmpty()) {
            if(command.contains("--create-admin")) {
                register(ERole.ROLE_ADMIN);
            } else {
                System.out.println("No command found");
            }
            exit(0);
        }
    }

    private void register(ERole role) {
        Console console = System.console();
        System.out.println("Creating local admin account...");
        String username = console.readLine("Username: ");
        if(userService.existsByUsername(username)) {
            System.out.println("User already exists");
            return;
        }
        String password = console.readLine("Password: ");
        String email = console.readLine("Email: ");
        if(!Validation.isEmailValid(email)) {
            System.out.println("Email is not valid!");
            return;
        }
        if(!Validation.isPasswordValid(password) || !Validation.isUsernameValid(username)) {
            System.out.println("Password or Username is not valid!");
            return;
        }
        User user = new User(username, email, password);
        user.setRole(role);
        userService.createUser(user);
        logService.log(username, Action.REGISTER_ADMIN);
        System.out.println(role.getName() + " " + username + " created");
    }
}

