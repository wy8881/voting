package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "election_status")
public class ElectionStatus {
    @Id
    @JsonIgnore
    private ObjectId id;

    private boolean isElectionStarted;
    private LocalDateTime statusUpatedTime;

    public ElectionStatus() {
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public boolean isElectionStarted() {
        return isElectionStarted;
    }

    public void setElectionStarted(boolean electionStarted) {
        isElectionStarted = electionStarted;
    }

    public LocalDateTime getStatusUpatedTime() {
        return statusUpatedTime;
    }

    public void setStatusUpatedTime(LocalDateTime statusUpatedTime) {
        this.statusUpatedTime = statusUpatedTime;
    }
}
