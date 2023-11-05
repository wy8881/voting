package com.example.voting.repositories;

import com.example.voting.model.Action;
import com.example.voting.model.Log;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface LogRepository extends MongoRepository<Log, ObjectId> {

    @Query("{ 'username' : ?0 }")
    List<Log> findAllByUsername(String name);




    @Query("{ 'action' : { $regex: ?0, $options: 'i' } }")
    List<Log> findAllByAction(String action);
}
