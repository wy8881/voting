package com.example.voting.controller;

import com.example.voting.model.Candidate;
import com.example.voting.model.Party;
import com.example.voting.payload.request.CreateCandidateRequest;
import com.example.voting.payload.request.CreatePartyRequest;
import com.example.voting.payload.response.MessageResponse;
import com.example.voting.service.DBService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delegate")
//@PreAuthorize("hasRole('ROLE_DELEGATE')")
public class DelegateController {
    @Autowired
    DBService DBService;
    private static final Logger logger = LoggerFactory.getLogger(DelegateController.class);

    @GetMapping("/test")
    public String test() {
        return "Test Delegate";
    }

    @PostMapping("/createCandidate")
    public ResponseEntity<?> CreateCandidate(@Valid @RequestBody CreateCandidateRequest createCandidateRequest) {
        if(DBService.candidateExistsByName(createCandidateRequest.getName()))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Candidate name is already taken!"));
        if(!DBService.partyExistsByName(createCandidateRequest.getParty()))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Party does not exist!"));
        Candidate candidate = DBService.createCandidate(createCandidateRequest.getName(), createCandidateRequest.getParty());
        return ResponseEntity.ok(new MessageResponse("Candidate created successfully!"));
    }

    @PostMapping("/createParty")
    public ResponseEntity<?> CreateParty(@Valid @RequestBody CreatePartyRequest createPartyRequest) {
        if(DBService.partyExistsByName(createPartyRequest.getName()))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Party name is already taken!"));
        DBService.createParty(createPartyRequest.getName());
        return ResponseEntity.ok(new MessageResponse("Party created successfully!"));
    }

    @GetMapping("/allCandidates")
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return new ResponseEntity<List<Candidate>>(DBService.getAllCandidates(), HttpStatus.OK);
    }

    @GetMapping("/allParties")
    public ResponseEntity<List<Party>> getAllParties() {
        return new ResponseEntity<List<Party>>(DBService.getAllParties(), HttpStatus.OK);
    }
}
