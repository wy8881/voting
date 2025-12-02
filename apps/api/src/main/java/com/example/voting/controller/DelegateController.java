package com.example.voting.controller;

import com.example.voting.model.Candidate;
import com.example.voting.model.Party;
import com.example.voting.model.User;
import com.example.voting.dto.common.CandidateTotalVote;
import com.example.voting.dto.request.CreateCandidateRequest;
import com.example.voting.dto.request.CreatePartyRequest;
import com.example.voting.dto.response.ElectionResultResponse;
import com.example.voting.dto.response.MessageResponse;
import com.example.voting.service.UserService;
import com.example.voting.service.PartyService;
import com.example.voting.service.ElectionService;
import com.example.voting.utils.Validation;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/delegate")
@PreAuthorize("hasRole('ROLE_DELEGATE')")
public class DelegateController {
    @Autowired
    UserService userService;
    @Autowired
    PartyService partyService;
    @Autowired
    ElectionService electionService;
    private static final Logger logger = LoggerFactory.getLogger(DelegateController.class);

    @GetMapping("/")
    public String test() {
        return "Test Delegate";
    }

    @PostMapping("/createCandidate")
    public ResponseEntity<?> CreateCandidate(@Valid @RequestBody CreateCandidateRequest createCandidateRequest) {
        try {
            String delegateUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User delegate = userService.getUserByUsername(delegateUsername);
            
            if (delegate != null && Boolean.TRUE.equals(delegate.getIsDemoAccount())) {
                long candidateCount = partyService.countCandidatesCreatedBy(delegateUsername);
                if (candidateCount >= 20) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Daily limit of 20 candidates reached!"));
                }
            }
            
            int rank = Integer.parseInt(createCandidateRequest.getRank());

        if(!Validation.isNameValid(createCandidateRequest.getName())
                || !Validation.isNameValid(createCandidateRequest.getParty())
                || !Validation.isRankValid(rank))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: The candidate is invalid!"));
        if(!partyService.partyExistsByName(createCandidateRequest.getParty()))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Party does not exist!"));
        partyService.createCandidate(createCandidateRequest.getName(), createCandidateRequest.getParty(), rank, delegateUsername);
        return ResponseEntity.ok(new MessageResponse("Candidate created successfully!"));
        }
        catch (NumberFormatException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Rank is not a number!"));
        }
        catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/createParty")
    public ResponseEntity<?> CreateParty(@Valid @RequestBody CreatePartyRequest createPartyRequest) {
        try{
            String delegateUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User delegate = userService.getUserByUsername(delegateUsername);
            
            if (delegate != null && Boolean.TRUE.equals(delegate.getIsDemoAccount())) {
                long partyCount = partyService.countPartiesCreatedBy(delegateUsername);
                if (partyCount >= 5) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Daily limit of 5 parties reached!"));
                }
            }
            
            if(!Validation.isNameValid(createPartyRequest.getName())) throw new RuntimeException("Error: Party name is invalid!");
            partyService.createParty(createPartyRequest.getName(), delegateUsername);
        }
        catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }

        return ResponseEntity.ok(new MessageResponse("Party created successfully!"));
    }
    @GetMapping("/result")
    public ResponseEntity<?> fetchResult() {
        try {
            return ResponseEntity.ok(electionService.candidateTotalVotes());
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/candidates/{candidateName}")
    public ResponseEntity<?> deleteCandidate(@PathVariable String candidateName) {
        try {
            String delegateUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User delegate = userService.getUserByUsername(delegateUsername);
            
            Candidate candidate = partyService.getCandidateByName(candidateName);
            if (candidate == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Candidate not found!"));
            }
            
            if (delegate != null && Boolean.TRUE.equals(delegate.getIsDemoAccount())) {
                if (Boolean.TRUE.equals(candidate.getIsSystemPreset())) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Cannot delete system preset candidates!"));
                }
                if (candidate.getCreatedBy() == null || !candidate.getCreatedBy().equals(delegateUsername)) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Can only delete your own candidates!"));
                }
            }
            
            partyService.deleteCandidate(candidateName);
            return ResponseEntity.ok(new MessageResponse("Candidate deleted successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/parties/{partyName}")
    public ResponseEntity<?> deleteParty(@PathVariable String partyName) {
        try {
            String delegateUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User delegate = userService.getUserByUsername(delegateUsername);
            
            Party party = partyService.getPartyByName(partyName);
            if (party == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Party not found!"));
            }
            
            if (delegate != null && Boolean.TRUE.equals(delegate.getIsDemoAccount())) {
                if (Boolean.TRUE.equals(party.getIsSystemPreset())) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Cannot delete system preset parties!"));
                }
                if (party.getCreatedBy() == null || !party.getCreatedBy().equals(delegateUsername)) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Can only delete your own parties!"));
                }
            }
            
            partyService.deleteParty(partyName);
            return ResponseEntity.ok(new MessageResponse("Party deleted successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

}
