package com.example.voting.repositories;

import com.example.voting.model.Ballot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BallotRepository extends MongoRepository<Ballot, ObjectId> {

    Optional<Ballot> findById(ObjectId id);
}
