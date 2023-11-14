package com.example.voting.controller;

import com.example.voting.model.Action;
import com.example.voting.model.CandidateTotalVote;
import com.example.voting.payload.request.VoteRequest;
import com.example.voting.payload.response.MessageResponse;
import com.example.voting.service.DBService;
import com.example.voting.service.LogService;
import com.example.voting.utils.Validation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/voter")
@PreAuthorize("hasRole('ROLE_VOTER')")
public class VoterController {
    @Autowired
    DBService dbService;
    @Autowired
    LogService logService;
    @GetMapping
    public String apiRoot() {
        return "hello";
    }

    @PostMapping("/vote")
    public ResponseEntity<?> vote(@Valid @RequestBody VoteRequest voteRequest) {
        try {
            String voterName = voteRequest.getVoterName();
            String type = voteRequest.getType();
            List<String> preferences = voteRequest.getPreferences();
            if(!Validation.isVoteValid(type, preferences, voterName)) {
                throw new RuntimeException("Invalid vote");
            }
            dbService.vote( preferences, voterName, type);

        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
        logService.log(voteRequest.getVoterName(), Action.VOTE);
        return ResponseEntity.ok().body(new MessageResponse("Vote successful"));
    }

    @GetMapping("/result")
    public List<CandidateTotalVote> fetchResult() {
        try {
            return dbService.candidateTotalVotes();
        }
        catch (Exception e) {
            return new ArrayList<>();
        }
    }

}
