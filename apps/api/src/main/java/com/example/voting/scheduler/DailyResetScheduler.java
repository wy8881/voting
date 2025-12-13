package com.example.voting.scheduler;

import com.example.voting.service.ElectionService;
import com.example.voting.service.DataInitializationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DailyResetScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DailyResetScheduler.class);

    @Autowired
    private ElectionService electionService;

    @Autowired
    private DataInitializationService dataInitializationService;

    @Value("${app.db.reset.enabled:true}")
    private boolean dbResetEnabled;

    @Scheduled(cron = "0 0 3 * * ?")
    public void performDailyReset() {
        if (!dbResetEnabled) {
            logger.info("Database reset is disabled. Skipping daily reset at 3:00 AM");
            return;
        }
        logger.info("Starting daily reset at 3:00 AM");
        
        try {
            electionService.resetDatabase(dataInitializationService);
            logger.info("Daily reset completed successfully");
        } catch (Exception e) {
            logger.error("Error during daily reset: {}", e.getMessage(), e);
        }
    }
}

