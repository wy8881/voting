package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "ballots")
public class Ballot {
    @Id
    @JsonIgnore
    private ObjectId id;
    @JsonIgnore
    private String anonymousId;
    private List<String> preferences;
    private String type;

    public Ballot() {
    }

    public Ballot(ObjectId id, String anonymousId, List<String> preferences, String type) {
        this.id = id;
        this.anonymousId = anonymousId;
        this.preferences = preferences;
        this.type = type;
    }

    public Ballot(String anonymousId, List<String> preferences, String type) {
        this.anonymousId = anonymousId;
        this.preferences = preferences;
        this.type = type;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getAnonymousId() {
        return anonymousId;
    }

    public void setAnonymousId(String anonymousId) {
        this.anonymousId = anonymousId;
    }

    public List<String> getPreferences() {
        return preferences;
    }

    public void setPreferences(List<String> preferences) {
        this.preferences = preferences;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
