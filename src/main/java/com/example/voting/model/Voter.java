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

@Document(collection = "voters")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Voter {
    @Id
    @JsonIgnore
    private ObjectId id;

    private String username;
    @DocumentReference
    private Ballot ballotId;

    public Voter(String username) {
        this.username = username;
    }
}
