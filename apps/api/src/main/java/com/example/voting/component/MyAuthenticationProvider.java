package com.example.voting.component;

import com.example.voting.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.example.voting.repositories.UserRepository;
import java.util.Collections;
import java.util.List;
@Component
public class MyAuthenticationProvider implements AuthenticationProvider {


    private final PasswordEncoder passwordEncoder;
    private final EncryptionUtil encryptionUtil;
    private final UserRepository userRepository;

    public MyAuthenticationProvider(PasswordEncoder passwordEncoder, EncryptionUtil encryptionUtil, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.encryptionUtil = encryptionUtil;
        this.userRepository = userRepository;
    }
    private static final Logger logger = LoggerFactory.getLogger(MyAuthenticationProvider.class);

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        logger.info("MyAuthenticationProvider - Attempting authentication for username: {}", username);
        
        User user = userRepository.findByUsername(username);
        if (user == null) {
            logger.error("MyAuthenticationProvider - User not found: {}", username);
            throw new BadCredentialsException("Authentication failed");
        }
        try {
            String decryptedEmail = encryptionUtil.decrypt(user.getEmail());
            user.setEmail(decryptedEmail);
        } catch (Exception e) {
            logger.error("MyAuthenticationProvider - Error decrypting email: {}", e.getMessage());
            throw new BadCredentialsException("Authentication failed");
        }

        String storedPassword = user.getPassword();
        logger.info("MyAuthenticationProvider - Stored password hash: {}", storedPassword != null ? storedPassword.substring(0, Math.min(20, storedPassword.length())) + "..." : "null");
        boolean matches = passwordEncoder.matches(password, storedPassword);
        logger.info("MyAuthenticationProvider - Password matches: {}", matches);
        
        if (matches) {
            List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(user.getRole().getName())
            );
            return new UsernamePasswordAuthenticationToken(username, password, authorities);
        } else {
            logger.error("MyAuthenticationProvider - Password mismatch for user: {}", username);
            throw new BadCredentialsException("Authentication failed");
        }
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(UsernamePasswordAuthenticationToken.class);
    }
}
