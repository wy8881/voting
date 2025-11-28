package com.example.voting.repositories;

import com.example.voting.model.ElectionResult;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ElectionResultRepository extends MongoRepository<ElectionResult, ObjectId> {
    Optional<ElectionResult> findFirstByOrderByLastCalculatedAtDesc();
}

