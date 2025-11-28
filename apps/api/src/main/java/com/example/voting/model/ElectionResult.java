package com.example.voting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.voting.dto.common.CandidateTotalVote;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "election_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectionResult {
    @Id
    @JsonIgnore
    private ObjectId id;
    private List<CandidateTotalVote> candidateTotalVotes;
    private LocalDateTime lastCalculatedAt;

    

}
