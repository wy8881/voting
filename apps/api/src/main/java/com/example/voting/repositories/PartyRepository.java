package com.example.voting.repositories;

import com.example.voting.model.Party;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartyRepository extends MongoRepository<Party, ObjectId> {
    Party findByName(String name);
    Boolean existsByName(String name);

}
