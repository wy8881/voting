package com.example.voting.controller;

import com.example.voting.model.Candidate;
import com.example.voting.model.Party;
import com.example.voting.service.DBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('ROLE_VOTER') || hasRole('ROLE_DELEGATE')")
public class UserController {

    @Autowired
    com.example.voting.service.DBService DBService;
    @GetMapping("/allCandidates")
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return new ResponseEntity<List<Candidate>>(DBService.getAllCandidates(), HttpStatus.OK);
    }

    @GetMapping("/allParties")
    public ResponseEntity<List<Party>> getAllParties() {
        return new ResponseEntity<List<Party>>(DBService.getAllParties(), HttpStatus.OK);
    }
}
