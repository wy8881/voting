package com.example.voting.dto.response;

import com.example.voting.model.Log;
import java.util.List;

public class LogsWithQuotaResponse {
    private List<Log> logs;
    private Integer remainingQuota;

    public LogsWithQuotaResponse() {
    }

    public LogsWithQuotaResponse(List<Log> logs, Integer remainingQuota) {
        this.logs = logs;
        this.remainingQuota = remainingQuota;
    }

    public List<Log> getLogs() {
        return logs;
    }

    public void setLogs(List<Log> logs) {
        this.logs = logs;
    }

    public Integer getRemainingQuota() {
        return remainingQuota;
    }

    public void setRemainingQuota(Integer remainingQuota) {
        this.remainingQuota = remainingQuota;
    }
}

