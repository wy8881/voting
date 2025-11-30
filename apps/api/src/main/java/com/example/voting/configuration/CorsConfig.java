package com.example.voting.configuration;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

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

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    public List<String> getAllowedMethods() {
        return allowedMethods;
    }

    public void setAllowedMethods(List<String> allowedMethods) {
        this.allowedMethods = allowedMethods;
    }

    public List<String> getAllowedHeaders() {
        return allowedHeaders;
    }

    public void setAllowedHeaders(List<String> allowedHeaders) {
        this.allowedHeaders = allowedHeaders;
    }

    public boolean isAllowCredentials() {
        return allowCredentials;
    }

    public void setAllowCredentials(boolean allowCredentials) {
        this.allowCredentials = allowCredentials;
    }

    public long getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(long maxAge) {
        this.maxAge = maxAge;
    }
}
