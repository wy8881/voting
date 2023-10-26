package com.example.voting.jwt;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint{

    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);


    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException, java.io.IOException {
        logger.error("Unauthorized error: {}", authException.getMessage());
        logger.error("Unauthorized cause: {}", authException.getCause());
        logger.error("class: {}", authException.getClass());
        logger.error("authException: {}", authException);
        logger.error("authException: {}", authException.getStackTrace());
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
    }

}
