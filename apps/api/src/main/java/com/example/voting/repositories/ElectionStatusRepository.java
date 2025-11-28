package com.example.voting.repositories;

import com.example.voting.model.ElectionStatus;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ElectionStatusRepository extends MongoRepository<ElectionStatus, ObjectId> {
    Optional<ElectionStatus> findByStatusUpatedTime(LocalDateTime statusUpatedTime);
    
    Optional<ElectionStatus> findFirstByOrderByStatusUpatedTimeDesc();
}
