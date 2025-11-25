package com.example.voting.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.voting.model.Voter;

@Repository
public interface VoterRepository extends MongoRepository<Voter, ObjectId> {

    Voter findByUsername(String username);

    Boolean existsByUsername(String username);

}
