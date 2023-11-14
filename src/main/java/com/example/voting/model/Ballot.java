package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Document(collection = "ballots")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ballot {
    @Id
    @JsonIgnore
    private ObjectId id;
    @JsonIgnore
    private String anonymousId;
    private List<String> preferences;
    private String type;


    public Ballot(String anonymousId, List<String> preferences, String type) {
        this.anonymousId = anonymousId;
        this.preferences = preferences;
        this.type = type;
    }
}
