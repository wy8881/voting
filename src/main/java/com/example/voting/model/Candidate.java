package com.example.voting.model;

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
    private ObjectId id;
    private String name;
    @DocumentReference
    private Party partyID;

    public Candidate(String name, Party partyID) {
        this.name = name;
        this.partyID = partyID;
    }

    public Candidate(String name) {
        this.name = name;
    }
}
