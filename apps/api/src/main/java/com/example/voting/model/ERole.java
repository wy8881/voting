package com.example.voting.model;

public enum ERole {
    ROLE_VOTER,
    ROLE_DELEGATE,
    ROLE_LOGGER,
    ROLE_ADMIN;

    public String getName() {
        return name();
    }
}
