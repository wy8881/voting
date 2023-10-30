package com.example.voting.controller;

import com.example.voting.model.Candidate;
import com.example.voting.model.Party;
import com.example.voting.payload.request.CreateCandidateRequest;
import com.example.voting.payload.request.CreatePartyRequest;
import com.example.voting.repositories.CandidateRepository;
import com.example.voting.repositories.PartyRepository;
import com.example.voting.service.DBService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delegate")
@PreAuthorize("hasRole('DELEGATE')")
public class DelegateController {
    @Autowired
    DBService DBService;

    @GetMapping("/test")
    public String test() {
        return "Test Delegate";
    }
    @PostMapping("/createCandidate")
    public String CreateCandidate(@Valid @RequestBody CreateCandidateRequest createCandidateRequest) {
        if(DBService.candidateExistsByName(createCandidateRequest.getName()))
            return "The name is already taken!";
        if(!DBService.partyExistsByName(createCandidateRequest.getParty()))
            return "The party does not exist!";
        Candidate candidate = DBService.createCandidate(createCandidateRequest.getName(), createCandidateRequest.getParty());
        return "Create Candidate";
    }

    @PostMapping("/createParty")
    public String CreateParty(@Valid @RequestBody CreatePartyRequest createPartyRequest) {
        if(DBService.partyExistsByName(createPartyRequest.getName()))
            return "The party is already taken!";
        DBService.createParty(createPartyRequest.getName());
        return "Create Party";
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
