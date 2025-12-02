package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "candidates")
public class Candidate {
    @Id
    @JsonIgnore
    private ObjectId id;
    @Indexed(unique = true)
    private String name;
    private String party;
    private Boolean isSystemPreset;
    private String createdBy;

    public Candidate() {
    }

    public Candidate(ObjectId id, String name, String party) {
        this.id = id;
        this.name = name;
        this.party = party;
    }

    public Candidate(String name, String party) {
        this.name = name;
        this.party = party;
        this.isSystemPreset = false;
        this.createdBy = null;
    }

    public Candidate(String name, String party, Boolean isSystemPreset, String createdBy) {
        this.name = name;
        this.party = party;
        this.isSystemPreset = isSystemPreset != null ? isSystemPreset : false;
        this.createdBy = createdBy;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParty() {
        return party;
    }

    public void setParty(String party) {
        this.party = party;
    }

    public Boolean getIsSystemPreset() {
        return isSystemPreset;
    }

    public void setIsSystemPreset(Boolean isSystemPreset) {
        this.isSystemPreset = isSystemPreset;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
