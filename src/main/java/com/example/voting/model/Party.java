package com.example.voting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Document(collection = "parties")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Party {
    @Id
    private ObjectId id;
    private String name;
    @DocumentReference
    private List<Candidate> candidatesID;

    public Party(String name) {
        this.name = name;
    }
}
