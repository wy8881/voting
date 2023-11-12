package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Document(collection = "parties")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Party {
    @Id
    @JsonIgnore
    private ObjectId id;
    @Indexed(unique = true)
    private String name;
    private List<String> candidates;

    public Party(String name) {
        this.name = name;
    }
}
