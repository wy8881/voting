package com.example.voting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
}
