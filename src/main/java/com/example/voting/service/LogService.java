package com.example.voting.service;

import com.example.voting.model.Action;
import com.example.voting.model.Log;
import com.example.voting.repositories.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LogService {
    @Autowired
    private LogRepository logRepository;

    public void log(String username, Action action, String body) {
        logRepository.insert(new Log(username, action.getName(), body));
    }

    public void log(String username, Action action) {
        logRepository.insert(new Log(username, action.getName(), ""));
    }

    public List<Log> findLogByUsername(String name) {
        return logRepository.findAllByUsername(name);
    }

    public List<Log> findLogByAction(String action) {
        return logRepository.findAllByAction(action);
    }

}
