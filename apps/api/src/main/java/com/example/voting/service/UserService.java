package com.example.voting.service;

import com.example.voting.model.ERole;
import com.example.voting.model.User;
import com.example.voting.model.Voter;
import com.example.voting.repositories.UserRepository;
import com.example.voting.repositories.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.voting.component.EncryptionUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VoterRepository voterRepository;
    
    @Autowired
    private EncryptionUtil encryptionUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        String encryptedEmail = encryptionUtil.encrypt(email);
        return userRepository.existsByEmail(encryptedEmail);
    }

    @Transactional
    public void createUser(User user) throws RuntimeException {
        if (existsByUsername(user.getUsername()) || voterRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEmail(encryptionUtil.encrypt(user.getEmail()));
        userRepository.save(user);
        if (user.getRole() == ERole.ROLE_VOTER) {
            voterRepository.save(new Voter(user.getUsername(), UUID.randomUUID().toString()));
        }
    }

    public User getUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getEmail() != null) {
            try {
                String decryptedEmail = encryptionUtil.decrypt(user.getEmail());
                user.setEmail(decryptedEmail);
            } catch (Exception e) {
                System.err.println("Error decrypting email for user " + username + ": " + e.getMessage());
            }
        }
        return user;
    }

    public boolean isDemoAccount(String username) {
        User user = getUserByUsername(username);
        return user != null && Boolean.TRUE.equals(user.getIsDemoAccount());
    }

    public List<User> getDelegatesAndLoggers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == ERole.ROLE_DELEGATE || user.getRole() == ERole.ROLE_LOGGER)
                .map(user -> {
                    if (user.getEmail() != null) {
                        try {
                            String decryptedEmail = encryptionUtil.decrypt(user.getEmail());
                            user.setEmail(decryptedEmail);
                        } catch (Exception e) {
                            System.err.println("Error decrypting email for user " + user.getUsername() + ": " + e.getMessage());
                        }
                    }
                    return user;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(String username) throws RuntimeException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (user.getRole() == ERole.ROLE_VOTER) {
            throw new RuntimeException("Cannot delete voter accounts");
        }
        if (user.getRole() == ERole.ROLE_ADMIN) {
            throw new RuntimeException("Cannot delete admin accounts");
        }
        userRepository.delete(user);
    }
}

