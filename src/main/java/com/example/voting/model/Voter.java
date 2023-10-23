package com.example.voting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Document(collection = "voter")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Voter {
    @Id
    private ObjectId id;

    private String username;
    private String password;
    @DocumentReference
    private Ballot ballotId;
}
