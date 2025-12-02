package com.example.voting.controller;

import com.example.voting.dto.response.MessageResponse;
import com.example.voting.model.Candidate;
import com.example.voting.model.Party;
import com.example.voting.service.PartyService;
import com.example.voting.service.ElectionService;
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
@PreAuthorize("hasRole('ROLE_VOTER') || hasRole('ROLE_DELEGATE') || hasRole('ROLE_ADMIN') || hasRole('ROLE_LOGGER')")
public class UserController {

    @Autowired
    PartyService partyService;
    @Autowired
    ElectionService electionService;
    
    @GetMapping("/allCandidates")
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return new ResponseEntity<List<Candidate>>(partyService.getAllCandidates(), HttpStatus.OK);
    }

    @GetMapping("/allParties")
    public ResponseEntity<List<Party>> getAllParties() {
        return new ResponseEntity<List<Party>>(partyService.getAllParties(), HttpStatus.OK);
    }

    @GetMapping("/electionStatus")
    public ResponseEntity<?> getElectionStatus() {
        return ResponseEntity.ok(electionService.getLatestElectionStatus());
    }

    @GetMapping("/electionResult")
    public ResponseEntity<?> getElectionResult() {
        try {
            return ResponseEntity.ok(electionService.getLatestElectionResult());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
