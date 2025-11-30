package com.example.voting.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "preferences")
@CompoundIndexes({
        @CompoundIndex(name = "party_rank_idx", def = "{'party' : 1, 'rank': 1}", unique = true)
})
public class Preference {
    @Id
    private ObjectId _id;
    private String candidateName;
    private String party;
    private int rank;

    public Preference() {
    }

    public Preference(ObjectId _id, String candidateName, String party, int rank) {
        this._id = _id;
        this.candidateName = candidateName;
        this.party = party;
        this.rank = rank;
    }

    public ObjectId get_id() {
        return _id;
    }

    public void set_id(ObjectId _id) {
        this._id = _id;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getParty() {
        return party;
    }

    public void setParty(String party) {
        this.party = party;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }
}
