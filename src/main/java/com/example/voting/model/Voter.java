package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
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
    @Indexed(unique = true)
    private String username;
    private boolean voted;

    public Voter(String username) {
        this.username = username;
    }
}
