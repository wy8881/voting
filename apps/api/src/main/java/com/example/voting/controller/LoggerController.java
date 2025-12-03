package com.example.voting.controller;
import com.example.voting.model.Action;
import com.example.voting.model.Log;
import com.example.voting.model.User;
import com.example.voting.dto.response.MessageResponse;
import com.example.voting.dto.response.LogsWithQuotaResponse;
import com.example.voting.service.LogService;
import com.example.voting.service.UserService;
import com.example.voting.utils.Validation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@PreAuthorize("hasRole('ROLE_LOGGER')")
public class LoggerController {
    @Autowired
    LogService logService;
    
    @Autowired
    UserService userService;
    
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getLogByUsername(@PathVariable String username) {
        String loggerUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User logger = userService.getUserByUsername(loggerUsername);
        
        if(!Validation.isUsernameValid(username)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid username!"));
        }
        
        // Check daily limit for demo logger
        if (logger != null && Boolean.TRUE.equals(logger.getIsDemoAccount())) {
            long todayCount = logService.countTodayActionsByUsername(loggerUsername, Action.DOWNLOAD_LOGS);
            if (todayCount >= 5) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Daily limit of 5 log downloads reached!"));
            }
        }
        
        List<Log> logs = logService.findLogByUsername(username);
        
        // Log download action and return remaining quota for demo logger
        if (logger != null && Boolean.TRUE.equals(logger.getIsDemoAccount())) {
            logService.log(loggerUsername, Action.DOWNLOAD_LOGS);
            long todayCount = logService.countTodayActionsByUsername(loggerUsername, Action.DOWNLOAD_LOGS);
            int remainingQuota = (int) (5 - todayCount);
            return ResponseEntity.ok(new LogsWithQuotaResponse(logs, remainingQuota));
        }
        
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<?> getLogByAction(@PathVariable String action) {
        String loggerUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User logger = userService.getUserByUsername(loggerUsername);
        
        if(!Validation.isNameValid(action)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid action!"));
        }
        
        // Check daily limit for demo logger
        if (logger != null && Boolean.TRUE.equals(logger.getIsDemoAccount())) {
            long todayCount = logService.countTodayActionsByUsername(loggerUsername, Action.DOWNLOAD_LOGS);
            if (todayCount >= 5) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Daily limit of 5 log downloads reached!"));
            }
        }
        
        List<Log> logs = logService.findLogByAction(action);
        
        // Log download action and return remaining quota for demo logger
        if (logger != null && Boolean.TRUE.equals(logger.getIsDemoAccount())) {
            logService.log(loggerUsername, Action.DOWNLOAD_LOGS);
            long todayCount = logService.countTodayActionsByUsername(loggerUsername, Action.DOWNLOAD_LOGS);
            int remainingQuota = (int) (5 - todayCount);
            return ResponseEntity.ok(new LogsWithQuotaResponse(logs, remainingQuota));
        }
        
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllLogs() {
        String loggerUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User logger = userService.getUserByUsername(loggerUsername);
        
        // Check daily limit for demo logger
        if (logger != null && Boolean.TRUE.equals(logger.getIsDemoAccount())) {
            long todayCount = logService.countTodayActionsByUsername(loggerUsername, Action.DOWNLOAD_LOGS);
            if (todayCount >= 5) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Daily limit of 5 log downloads reached!"));
            }
        }
        
        List<Log> logs = logService.findAllLogs();
        
        // Log download action and return remaining quota for demo logger
        if (logger != null && Boolean.TRUE.equals(logger.getIsDemoAccount())) {
            logService.log(loggerUsername, Action.DOWNLOAD_LOGS);
            long todayCount = logService.countTodayActionsByUsername(loggerUsername, Action.DOWNLOAD_LOGS);
            int remainingQuota = (int) (5 - todayCount);
            return ResponseEntity.ok(new LogsWithQuotaResponse(logs, remainingQuota));
        }
        
        return ResponseEntity.ok(logs);
    }
}
