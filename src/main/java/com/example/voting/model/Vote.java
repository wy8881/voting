package com.example.voting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "votes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vote {
    @Id
    private ObjectId id;
    private String candidateName;
    private int num;
    @DBRef
    private Ballot ballot;

    public Vote(String s, int i) {
        this.candidateName = s;
        this.num = i;
    }
}
