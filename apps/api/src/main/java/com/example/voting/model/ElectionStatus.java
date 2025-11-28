package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "election_status")
@Data
@NoArgsConstructor
public class ElectionStatus {
    @Id
    @JsonIgnore
    private ObjectId id;

    private boolean isElectionStarted;
    private LocalDateTime statusUpatedTime;
    
}
