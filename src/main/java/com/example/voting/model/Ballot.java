package com.example.voting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "ballots")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ballot {
    @Id
    private ObjectId id;
    private List<String> ballotBody;
}
