package com.example.voting.component;

import com.example.voting.model.Action;
import com.example.voting.model.ERole;
import com.example.voting.model.User;
import com.example.voting.service.DBService;
import com.example.voting.service.LogService;
import com.example.voting.utils.Validation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.Console;
import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;

import static java.lang.System.exit;

@Component
public class LocalAccountCreate implements CommandLineRunner {
    @Autowired
    private DBService dbService;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    LogService logService;

    @Override
    public void run(String... args) throws Exception {
        List<String> command = Arrays.asList(args);
        if(!command.isEmpty()) {
            Console console = System.console();
            while (true) {
                if(command.contains("--create-admin")) {
                    register(ERole.ROLE_ADMIN);
                } else if(command.contains("--create-delegate")) {
                    register(ERole.ROLE_DELEGATE);
                } else if(command.contains("--create-logger")) {
                    register(ERole.ROLE_LOGGER);
                }
                else {
                    System.out.println("No command found");
                    exit(0);
                }
                command = Arrays.asList(console.readLine("Enter command: ").split(" "));
            }
        }
    }

    private void register(ERole role) {
        Console console = System.console();
        System.out.println("Creating local account...");
        String username = console.readLine("Username: ");
        if(dbService.existsByUsername(username)) {
            System.out.println("User already exists");
            return;
        }
        String password = console.readLine("Password: ");
        String email = console.readLine("Email: ");
        if(dbService.existsByEmail(email)) {
            System.out.println("Email already exists");
            return;
        }
        if(!Validation.isPasswordValid(password) || !Validation.isUsernameValid(username)) {
            System.out.println("Password or Username is not valid!");
            return;
        }
        User user = new User(username, email, encoder.encode(password));
        user.setRole(role);
        dbService.createUser(user);
        switch (role) {
            case ROLE_ADMIN:
                logService.log(username,Action.REGISTER_ADMIN);
                break;
            case ROLE_DELEGATE:
                logService.log(username, Action.REGISTER_DELEGATE);
                break;
            case ROLE_LOGGER:
                logService.log(username, Action.REGISTER_LOGGER);
                break;
        }
        System.out.println(role.getName() + " " + username + " created");
    }
}
