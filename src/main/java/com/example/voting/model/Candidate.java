package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "candidates")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Candidate {
    @Id
    @JsonIgnore
    private ObjectId id;
    private String name;
    private String party;

    public Candidate(String name, String party) {
        this.name = name;
        this.party = party;
    }

}
