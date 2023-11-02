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
    @DocumentReference
    private String voter;
    private List<String> ballotBody;

    public Ballot(String voter, List<String> ballotBody) {
        this.voter = voter;
        this.ballotBody = ballotBody;
    }
}
