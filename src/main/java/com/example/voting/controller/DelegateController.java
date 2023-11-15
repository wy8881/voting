package com.example.voting.controller;

import com.example.voting.model.Candidate;
import com.example.voting.model.CandidateTotalVote;
import com.example.voting.model.Party;
import com.example.voting.payload.request.CreateCandidateRequest;
import com.example.voting.payload.request.CreatePartyRequest;
import com.example.voting.payload.response.MessageResponse;
import com.example.voting.service.DBService;
import com.example.voting.utils.Validation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/delegate")
@PreAuthorize("hasRole('ROLE_DELEGATE')")
public class DelegateController {
    @Autowired
    DBService DBService;
    private static final Logger logger = LoggerFactory.getLogger(DelegateController.class);

    @GetMapping("/")
    public String test() {
        return "Test Delegate";
    }

    @PostMapping("/createCandidate")
    public ResponseEntity<?> CreateCandidate(@Valid @RequestBody CreateCandidateRequest createCandidateRequest) {
        try {
            int rank = Integer.parseInt(createCandidateRequest.getRank());

        if(!Validation.isNameValid(createCandidateRequest.getName())
                || !Validation.isNameValid(createCandidateRequest.getParty())
                || !Validation.isRankValid(rank))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: The candidate is invalid!"));
        if(!DBService.partyExistsByName(createCandidateRequest.getParty()))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Party does not exist!"));
        DBService.createCandidate(createCandidateRequest.getName(), createCandidateRequest.getParty(), rank);
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
            if(!Validation.isNameValid(createPartyRequest.getName())) throw new RuntimeException("Error: Party name is invalid!");
            DBService.createParty(createPartyRequest.getName());
        }
        catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }

        return ResponseEntity.ok(new MessageResponse("Party created successfully!"));
    }
    @GetMapping("/result")
    public List<CandidateTotalVote> fetchResult() {
        try {
            return DBService.candidateTotalVotes();
        }
        catch (Exception e) {
            return new ArrayList<>();
        }
    }

}
