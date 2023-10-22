package com.example.voting.component;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.Getter;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

@Getter
public class MyWebAuthenticationDetails  extends WebAuthenticationDetails {

    private final String role;

    public MyWebAuthenticationDetails(HttpServletRequest request) {
        super(request);
        role = request.getParameter("role");
    }

}
