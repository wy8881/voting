package com.example.voting.dto.response;

public class MessageWithQuotaResponse {
    private String message;
    private Integer remainingQuota;

    public MessageWithQuotaResponse() {
    }

    public MessageWithQuotaResponse(String message, Integer remainingQuota) {
        this.message = message;
        this.remainingQuota = remainingQuota;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getRemainingQuota() {
        return remainingQuota;
    }

    public void setRemainingQuota(Integer remainingQuota) {
        this.remainingQuota = remainingQuota;
    }
}

