package com.example.voting.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/voter")
@PreAuthorize("hasRole('ROLE_VOTER')")
public class VoterController {

    @GetMapping
    public String apiRoot() {
        return "hello";
    }
}
