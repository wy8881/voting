package com.example.voting.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "votes")
public class Vote {
    @Id
    private ObjectId id;
    private String candidateName;
    private int num;
    @DBRef
    private Ballot ballot;

    public Vote() {
    }

    public Vote(ObjectId id, String candidateName, int num, Ballot ballot) {
        this.id = id;
        this.candidateName = candidateName;
        this.num = num;
        this.ballot = ballot;
    }

    public Vote(String s, int i) {
        this.candidateName = s;
        this.num = i;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }

    public Ballot getBallot() {
        return ballot;
    }

    public void setBallot(Ballot ballot) {
        this.ballot = ballot;
    }
}
