package com.example.voting.controller;
import com.example.voting.model.Log;
import com.example.voting.service.LogService;
import com.example.voting.utils.Validation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@PreAuthorize("hasRole('ROLE_LOGGER')")
public class LoggerController {
    @Autowired
    LogService logService;
    @GetMapping("/username/{username}")
    public List<Log> getLogByUsername(@PathVariable String username) {
        if(!Validation.isUsernameValid(username)) {
            return null;
        }
        return logService.findLogByUsername(username);

    }

    @GetMapping("/action/{action}")
    public List<Log> getLogByAction(@PathVariable String action) {
        if(!Validation.isNameValid(action)) {
            return null;
        }
        return logService.findLogByAction(action);
    }

    // get all logs
    @GetMapping("/all")
    public List<Log> getAllLogs() {
        return logService.findAllLogs();
    }
}
