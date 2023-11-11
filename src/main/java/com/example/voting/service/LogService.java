package com.example.voting.service;

import com.example.voting.component.EncryptionUtil;
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

    public void log(String username, Action action) {
        logRepository.insert(new Log(username, action.toString()).encrypt());
    }

    public List<Log> findLogByUsername(String name) {
        List<Log> result = logRepository.findAllByUsername(EncryptionUtil.encrypt(name));
        List<Log> decrypted = new ArrayList<>();
        for (Log log : result) {
            decrypted.add(log.decrypt());
        }
        return decrypted;
    }

    public List<Log> findLogByAction(String action) {
        List<Log> result =logRepository.findAllByAction(EncryptionUtil.encrypt(action.toUpperCase()));
        List<Log> decrypted = new ArrayList<>();
        for (Log log : result) {
            decrypted.add(log.decrypt());
        }
        return decrypted;
    }

}
