package com.example.voting.repositories;

import com.example.voting.model.Preference;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PreferenceRepository extends MongoRepository<Preference, String> {
    Optional<Preference> findByPartyAndRank(String party, int rank);
    List<Preference> findByPartyOrderByRankAsc(String party);

    Optional<Preference> findByParty(String party);
}

