package com.example.voting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "log")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vote {
    @Id
    private ObjectId id;

    private String username;
    private List<String> vote;
}
