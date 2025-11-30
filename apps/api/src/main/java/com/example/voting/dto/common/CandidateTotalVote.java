package com.example.voting.dto.common;

public class CandidateTotalVote {
    private String candidateName;
    private Long totalVotes;

    public CandidateTotalVote() {
    }

    public CandidateTotalVote(String candidateName, Long totalVotes) {
        this.candidateName = candidateName;
        this.totalVotes = totalVotes;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public Long getTotalVotes() {
        return totalVotes;
    }

    public void setTotalVotes(Long totalVotes) {
        this.totalVotes = totalVotes;
    }
}

