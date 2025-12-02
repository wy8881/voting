package com.example.voting.service;

import com.example.voting.model.*;
import com.example.voting.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class VoteService {
    @Autowired
    private VoterRepository voterRepository;
    
    @Autowired
    private BallotRepository ballotRepository;
    
    @Autowired
    private VoteRespository voteRespository;
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private PreferenceRepository preferenceRepository;
    
    @Autowired
    private PartyRepository partyRepository;
    
    @Autowired
    private MongoTemplate mongoTemplate;

    public boolean hasVote(String username) {
        Voter voter = voterRepository.findByUsername(username);
        return voter != null && voter.isVoted();
    }

    public List<String> convert2Candidates(List<String> parties) throws RuntimeException {
        List<String> candidates = new ArrayList<>();
        for (String party : parties) {
            if (!partyRepository.existsByName(party)) {
                String message = "Party=" + party + " does not exist";
                throw new RuntimeException(message);
            }

            for (int i = 2; i > 0; i--) {
                Optional<Preference> preference = preferenceRepository.findByPartyAndRank(party, i);
                if (preference.isPresent()) {
                    candidates.add(preference.get().getCandidateName());
                } else {
                    throw new RuntimeException("Vote failed");
                }
            }
        }
        return candidates;
    }

    @Transactional
    public void vote(List<String> preferences, String username, String type) throws RuntimeException {
        Voter voter = voterRepository.findByUsername(username);
        if (voter == null) {
            throw new RuntimeException("Voter does not exist");
        }
        String anonymousId = voter.getAnonymousId();
        if (anonymousId == null || anonymousId.isEmpty()) {
            anonymousId = UUID.randomUUID().toString();
            voter.setAnonymousId(anonymousId);
            voterRepository.save(voter);
        }
        Ballot ballot = ballotRepository.insert(new Ballot(anonymousId, preferences, type));
        if (type.equals("party")) {
            preferences = convert2Candidates(preferences);
        }
        if (hasVote(username)) {
            throw new RuntimeException("You have already voted");
        }
        mongoTemplate.update(Voter.class)
                .matching(Criteria.where("username").is(username))
                .apply(new Update().set("voted", true))
                .first();
        int size = preferences.size();
        for (int i = 0; i < size; i++) {
            Vote vote = new Vote(preferences.get(i), size - i);
            if (!candidateRepository.existsByName(preferences.get(i))) {
                throw new RuntimeException("Candidate does not exist");
            }
            Vote newVote = voteRespository.insert(vote);
            mongoTemplate.update(Vote.class)
                    .matching(Criteria.where("id").is(newVote.getId()))
                    .apply(new Update().set("ballot", ballot))
                    .first();
        }
    }

    @Transactional
    public void deleteAllVotes() {
        voteRespository.deleteAll();
        ballotRepository.deleteAll();
        voterRepository.findAll().forEach(voter -> {
            voter.setVoted(false);
            voterRepository.save(voter);
        });
    }
}

