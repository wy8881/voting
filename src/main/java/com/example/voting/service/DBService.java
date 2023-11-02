package com.example.voting.service;

import com.example.voting.model.*;
import com.example.voting.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class DBService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VoterRepository voterRepository;
    @Autowired
    private BallotRepository  ballotRepository;
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private PartyRepository partyRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean candidateExistsByName(String name) {
        return candidateRepository.existsByName(name);
    }

    public boolean partyExistsByName(String name) {
        return partyRepository.existsByName(name);
    }

    public void createUser(User user) {
        userRepository.save(user);
    }
    public void createVoter(String username) {voterRepository.insert(new Voter(username));}
    public boolean hasVote(String username) {
        Voter voter = voterRepository.findByUsername(username);
        return voter.getBallotId() != null;
    }
    public Ballot vote(List<String> ballotBody, String username) {
        Ballot ballot = ballotRepository.insert(new Ballot(username, ballotBody));

        mongoTemplate.update(Voter.class)
                .matching(Criteria.where("username").is(username))
                .apply(new Update().push("ballotId", ballot))
                .first();

        return ballot;
    }

    public Candidate createCandidate(String name, String partyName) {
        Candidate candidate = candidateRepository.insert(new Candidate(name));
        Party party = partyRepository.findByName(partyName);
        mongoTemplate.update(Candidate.class)
                .matching(Criteria.where("name").is(name))
                .apply(new Update().push("partyID", party))
                .first();
        mongoTemplate.update(Party.class)
                .matching(Criteria.where("name").is(partyName))
                .apply(new Update().push("candidatesID", candidate))
                .first();
        return candidateRepository.findByName(name);
    }

    public void createParty(String name) {
        partyRepository.insert(new Party(name));
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public List<Party> getAllParties() {
        return partyRepository.findAll();
    }

}
