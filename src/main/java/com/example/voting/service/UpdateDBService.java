package com.example.voting.service;

import com.example.voting.model.Ballot;
import com.example.voting.model.Candidate;
import com.example.voting.model.Party;
import com.example.voting.model.Voter;
import com.example.voting.repositories.BallotRepository;
import com.example.voting.repositories.CandidateRepository;
import com.example.voting.repositories.PartyRepository;
import com.example.voting.repositories.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UpdateDBService {
    @Autowired
    private BallotRepository  ballotRepository;
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private PartyRepository partyRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

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

    public Party createParty(String name) {
        return partyRepository.insert(new Party(name));
    }

}
