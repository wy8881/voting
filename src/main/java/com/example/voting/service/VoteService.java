package com.example.voting.service;

import com.example.voting.model.Ballot;
import com.example.voting.model.Voter;
import com.example.voting.repositories.BallotRepository;
import com.example.voting.repositories.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class VoteService {
    @Autowired
    private BallotRepository  ballotRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Ballot vote(List<String> ballotBody, String username) {
        Ballot ballot = ballotRepository.insert(new Ballot(null, ballotBody));

        mongoTemplate.update(Voter.class)
                .matching(Criteria.where("username").is(username))
                .apply(new Update().push("ballotId", ballot))
                .first();

        return ballot;
    }

}
