package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.UUID;

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
    private String anonymousId;
    private boolean voted;

    public Voter(String username, String anonymousId) {

        this.username = username;
        this.anonymousId = anonymousId;
    }

}
