package com.example.voting.component;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

public class MyWebAuthenticationDetails  extends WebAuthenticationDetails {

    private final String role;

    public MyWebAuthenticationDetails(HttpServletRequest request) {
        super(request);
        role = request.getParameter("role");
    }

    public String getRole() {
        return role;
    }
}
