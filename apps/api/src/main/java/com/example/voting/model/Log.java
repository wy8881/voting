package com.example.voting.model;

import com.example.voting.component.EncryptionUtil;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="logs")
public class Log {
    @Id
    private ObjectId id;
    private String username;
    private String action;

    public Log() {
    }

    public Log(ObjectId id, String username, String action) {
        this.id = id;
        this.username = username;
        this.action = action;
    }

    public Log(String username, String action) {
        this.username = username;
        this.action = action;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
