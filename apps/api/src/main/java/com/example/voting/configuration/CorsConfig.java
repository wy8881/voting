package com.example.voting.configuration;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "app.cors")
@Validated  
public class CorsConfig {
    @NotEmpty(message = "Allowed origins cannot be empty")
    private List<String> allowedOrigins;
    @NotEmpty(message = "Allowed methods cannot be empty")
    private List<String> allowedMethods;
    @NotEmpty(message = "Allowed headers cannot be empty")  
    private List<String> allowedHeaders;
    @NotNull(message = "Allow credentials cannot be null")
    private boolean allowCredentials;
    @NotNull(message = "Max age cannot be null")
    private long maxAge;

}
