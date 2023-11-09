package com.example.voting.controller;
import com.example.voting.model.Log;
import com.example.voting.service.LogService;
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
        return logService.findLogByUsername(username);

    }

    @GetMapping("/action/{action}")
    public List<Log> getLogByAction(@PathVariable String action) {
        return logService.findLogByAction(action);
    }
}
