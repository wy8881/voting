package com.example.voting.repositories;

import com.example.voting.model.Candidate;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends MongoRepository<Candidate, ObjectId>{
    Candidate findByName(String name);
    Boolean existsByName(String name);

}
