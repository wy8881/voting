package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "voters")
public class Voter {
    @Id
    @JsonIgnore
    private ObjectId id;
    @Indexed(unique = true)
    private String username;
    private String anonymousId;
    private boolean voted;

    public Voter() {
    }

    public Voter(ObjectId id, String username, String anonymousId, boolean voted) {
        this.id = id;
        this.username = username;
        this.anonymousId = anonymousId;
        this.voted = voted;
    }

    public Voter(String username, String anonymousId) {
        this.username = username;
        this.anonymousId = anonymousId;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAnonymousId() {
        return anonymousId;
    }

    public void setAnonymousId(String anonymousId) {
        this.anonymousId = anonymousId;
    }

    public boolean isVoted() {
        return voted;
    }

    public void setVoted(boolean voted) {
        this.voted = voted;
    }
}
