package com.example.voting.dto.response;

import com.example.voting.dto.common.CandidateTotalVote;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectionResultResponse {
    private List<CandidateTotalVote> candidateTotalVotes;
    private LocalDateTime lastCalculatedAt;
    
}
