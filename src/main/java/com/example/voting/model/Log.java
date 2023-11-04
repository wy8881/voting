package com.example.voting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="logs")
public class Log {
    @Id
    private ObjectId id;
    private String username;
    private Action action;
    private String body;

    public Log(String username, Action action, String body) {
        this.username = username;
        this.action = action;
        this.body = body;
    }
}
