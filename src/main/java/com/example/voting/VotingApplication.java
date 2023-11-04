package com.example.voting;

import com.example.voting.component.LocalAccountCreate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@SpringBootApplication
@RestController
public class VotingApplication {

    public static void main(String[] args) {
        SpringApplication.run(VotingApplication.class, args);
    }

    @GetMapping("/api")
    public String apiRoot() {
        return "hello";
    }

}
