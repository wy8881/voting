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

    @Autowired
    private EncryptionUtil encryptionUtil;

    public void log(String username, Action action) {
        Log encrypted_log = new Log(encryptionUtil.encrypt(username), encryptionUtil.encrypt(action.toString()));
        logRepository.insert(encrypted_log);
    }

    public List<Log> findLogByUsername(String name) {
        List<Log> result = logRepository.findAllByUsername(encryptionUtil.encrypt(name));
        List<Log> decrypted = new ArrayList<>();
        for (Log log : result) {
            Log decryped_log = new Log(log.getId(), encryptionUtil.decrypt(log.getUsername()), encryptionUtil.decrypt(log.getAction()));
            decrypted.add(decryped_log);
        }
        return decrypted;
    }

    public List<Log> findLogByAction(String action) {
        List<Log> result =logRepository.findAllByAction(encryptionUtil.encrypt(action.toUpperCase()));
        List<Log> decrypted = new ArrayList<>();
        for (Log log : result) {
            Log decryped_log = new Log(log.getId(), encryptionUtil.decrypt(log.getUsername()), encryptionUtil.decrypt(log.getAction()));
            decrypted.add(decryped_log);
        }
        return decrypted;
    }

    public List<Log> findAllLogs() {
        List<Log> result = logRepository.findAll();
        List<Log> decrypted = new ArrayList<>();
        for (Log log : result) {
            Log decryped_log = new Log(log.getId(), encryptionUtil.decrypt(log.getUsername()), encryptionUtil.decrypt(log.getAction()));
            decrypted.add(decryped_log);
        }
        return decrypted;
    }

}
