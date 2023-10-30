package com.example.voting.controller;

import com.example.voting.model.Candidate;
import com.example.voting.payload.request.CreateCandidateRequest;
import com.example.voting.payload.request.CreatePartyRequest;
import com.example.voting.repositories.CandidateRepository;
import com.example.voting.repositories.PartyRepository;
import com.example.voting.service.UpdateDBService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delegate")
@PreAuthorize("hasRole('DELEGATE')")
public class DelegateController {
    @Autowired
    CandidateRepository candidateRepository;
    @Autowired
    PartyRepository partyRepository;
    @Autowired
    UpdateDBService updateDBService;

    @GetMapping("/test")
    public String test() {
        return "Test Delegate";
    }
    @PostMapping("/createCandidate")
    public String CreateCandidate(@Valid @RequestBody CreateCandidateRequest createCandidateRequest) {
        if(candidateRepository.existsByName(createCandidateRequest.getName()))
            return "The name is already taken!";
        if(!partyRepository.existsByName(createCandidateRequest.getParty()))
            return "The party does not exist!";
        Candidate candidate = updateDBService.createCandidate(createCandidateRequest.getName(), createCandidateRequest.getParty());
        return "Create Candidate";
    }

    @PostMapping("/createParty")
    public String CreateParty(@Valid @RequestBody CreatePartyRequest createPartyRequest) {
        if(partyRepository.existsByName(createPartyRequest.getName()))
            return "The party is already taken!";
        updateDBService.createParty(createPartyRequest.getName());
        return "Create Party";
    }
}
