package com.example.voting.model;



public enum Action {
    LOGIN,
    LOGOUT,
    REGISTER_ADMIN,
    REGISTER_LOGGER,
    REGISTER_DELEGATE,
    REGISTER_VOTER,
    VOTE,
    CREATE_VOTER,
    CREATE_DELEGATE,
    CREATE_CANDIDATE,
    CREATE_PARTY,
    DELETE_CANDIDATE,
    DELETE_PARTY,
    DELETE_DELEGATE,
    MODIFY_CANDIDATE,
    MODIFY_PARTY,
    DOWNLOAD_LOGS;


    public String getName() {
        return name();
    }
}
