package com.example.voting.scheduler;

import com.example.voting.service.ElectionService;
import com.example.voting.service.DataInitializationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DailyResetScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DailyResetScheduler.class);

    @Autowired
    private ElectionService electionService;

    @Autowired
    private DataInitializationService dataInitializationService;

    @Scheduled(cron = "0 0 3 * * ?")
    public void performDailyReset() {
        logger.info("Starting daily reset at 3:00 AM");
        
        try {
            logger.info("Deleting all data from database");
            electionService.deleteAllData();
            logger.info("Deleted all data from database");
            
            logger.info("Initializing preset data");
            dataInitializationService.initializePresetData();
            logger.info("Initialized preset data");
            
            logger.info("Initializing fixed accounts");
            dataInitializationService.initializeFixedAccountsAfterReset();
            logger.info("Initialized fixed accounts");
            
            logger.info("Daily reset completed successfully");
        } catch (Exception e) {
            logger.error("Error during daily reset: {}", e.getMessage(), e);
        }
    }
}

