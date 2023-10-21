package com.example.voting.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "log")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vote {
    @Id
    private String id;

    private String username;
    private List<String> vote;
}
