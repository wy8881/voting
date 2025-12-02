package com.example.voting.component;

import com.example.voting.service.DataInitializationService;
import com.example.voting.service.ElectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializationComponent implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializationComponent.class);

    @Autowired
    private DataInitializationService dataInitializationService;

    @Autowired
    private ElectionService electionService;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting database reset on application startup...");
        electionService.resetDatabase(dataInitializationService);
        logger.info("Data initialization completed");
    }
}

