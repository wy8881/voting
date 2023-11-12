package com.example.voting.repositories;

import com.example.voting.model.Vote;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRespository extends MongoRepository<Vote, ObjectId> {
    Optional<Vote> findByCandidateName(String candidateName);
}
