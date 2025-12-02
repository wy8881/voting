package com.example.voting.controller;

import com.example.voting.model.Action;
import com.example.voting.dto.request.VoteRequest;
import com.example.voting.dto.response.MessageResponse;
import com.example.voting.service.VoteService;
import com.example.voting.service.PartyService;
import com.example.voting.service.LogService;
import com.example.voting.service.ElectionService;
import com.example.voting.utils.Validation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/voter")
@PreAuthorize("hasRole('ROLE_VOTER')")
public class VoterController {
    @Autowired
    VoteService voteService;
    @Autowired
    PartyService partyService;
    @Autowired
    LogService logService;
    @Autowired
    ElectionService electionService;
    @GetMapping
    public String apiRoot() {
        return "hello";
    }

    @PostMapping("/vote")
    public ResponseEntity<?> vote(@Valid @RequestBody VoteRequest voteRequest) {
        try {
            if (!electionService.isElectionStarted()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Election is not started. Voting is not allowed."));
            }
            
            String voterName = voteRequest.getVoterName();
            String type = voteRequest.getType();
            List<String> preferences = voteRequest.getPreferences();
            
            int expectedCount = getExpectedCount(type);
            if(!Validation.isVoteValid(type, preferences, voterName, expectedCount)) {
                throw new RuntimeException("Invalid vote");
            }
            voteService.vote(preferences, voterName, type);

        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
        logService.log(voteRequest.getVoterName(), Action.VOTE);
        return ResponseEntity.ok().body(new MessageResponse("Vote successful"));
    }

    private int getExpectedCount(String type) {
        if (type.equals("party")) {
            return partyService.getPartiesCount();
        } else if (type.equals("candidate")) {
            return partyService.getCandidatesCount();
        } else {
            throw new RuntimeException("Invalid vote type");
        }
    }



}
