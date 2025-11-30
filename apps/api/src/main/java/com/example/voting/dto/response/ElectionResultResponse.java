package com.example.voting.dto.response;

import com.example.voting.dto.common.CandidateTotalVote;

import java.time.LocalDateTime;
import java.util.List;

public class ElectionResultResponse {
    private List<CandidateTotalVote> candidateTotalVotes;
    private LocalDateTime lastCalculatedAt;

    public ElectionResultResponse() {
    }

    public ElectionResultResponse(List<CandidateTotalVote> candidateTotalVotes, LocalDateTime lastCalculatedAt) {
        this.candidateTotalVotes = candidateTotalVotes;
        this.lastCalculatedAt = lastCalculatedAt;
    }

    public List<CandidateTotalVote> getCandidateTotalVotes() {
        return candidateTotalVotes;
    }

    public void setCandidateTotalVotes(List<CandidateTotalVote> candidateTotalVotes) {
        this.candidateTotalVotes = candidateTotalVotes;
    }

    public LocalDateTime getLastCalculatedAt() {
        return lastCalculatedAt;
    }

    public void setLastCalculatedAt(LocalDateTime lastCalculatedAt) {
        this.lastCalculatedAt = lastCalculatedAt;
    }
}
