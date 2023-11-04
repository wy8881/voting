package com.example.voting.service;

import com.example.voting.model.Action;
import com.example.voting.model.Log;
import com.example.voting.repositories.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {
    @Autowired
    private LogRepository logRepoistory;

    public void log(String username, Action action, String body) {
        logRepoistory.insert(new Log(username, action, body));
    }

    public void log(String username, Action action) {
        logRepoistory.insert(new Log(username, action, ""));
    }

    public List<Log> findLogByUsername(String name) {
        return logRepoistory.findAllByUsername(name);
    }

    public List<Log> findLogByAction(String action) {
        return logRepoistory.findAllByAction(action);
    }
}
