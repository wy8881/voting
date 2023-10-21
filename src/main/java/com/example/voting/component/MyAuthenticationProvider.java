package com.example.voting.component;

import com.example.voting.entity.User;
import com.example.voting.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class MyAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        System.out.println(username);
        String password = authentication.getCredentials().toString();
        String role = ((MyWebAuthenticationDetails) authentication.getDetails()).getRole();
        User user = userRepository.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())
//                && user.getRole().name().equals(role)
        ) {
            return new UsernamePasswordAuthenticationToken(username, password, new ArrayList<>());
        } else {
            throw new BadCredentialsException("Authentication failed");
        }
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(UsernamePasswordAuthenticationToken.class);
    }
}
