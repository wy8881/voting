package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.voting.dto.common.CandidateTotalVote;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "election_results")
public class ElectionResult {
    @Id
    @JsonIgnore
    private ObjectId id;
    private List<CandidateTotalVote> candidateTotalVotes;
    private LocalDateTime lastCalculatedAt;

    public ElectionResult() {
    }

    public ElectionResult(ObjectId id, List<CandidateTotalVote> candidateTotalVotes, LocalDateTime lastCalculatedAt) {
        this.id = id;
        this.candidateTotalVotes = candidateTotalVotes;
        this.lastCalculatedAt = lastCalculatedAt;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public List<CandidateTotalVote> getCandidateTotalVotes() {
        return candidateTotalVotes;
    }

    public void setCandidateTotalVotes(List<CandidateTotalVote> candidateTotalVotes) {
        this.candidateTotalVotes = candidateTotalVotes;
    }

    public LocalDateTime getLastCalculatedAt() {
        return lastCalculatedAt;
    }

    public void setLastCalculatedAt(LocalDateTime lastCalculatedAt) {
        this.lastCalculatedAt = lastCalculatedAt;
    }
}
