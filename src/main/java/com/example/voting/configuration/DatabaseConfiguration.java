package com.example.voting.configuration;

import com.example.voting.converter.DecryptingCoverter;
import com.example.voting.converter.EncryptConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.util.Arrays;
@Configuration
public class DatabaseConfiguration {
    @Bean
    public MongoCustomConversions customConversions() {
        return new MongoCustomConversions(Arrays.asList(
                new EncryptConverter(),
                new DecryptingCoverter()
        ));
    }

}
