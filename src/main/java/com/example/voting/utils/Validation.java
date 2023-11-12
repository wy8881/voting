package com.example.voting.utils;

import java.util.List;

public class Validation {
    public static boolean isUsernameValid(String name) {
        return name.matches("^[a-zA-Z0-9_]*$");
    }

    public static boolean isNameValid(String name) {
        return name.matches("^[a-zA-Z\\s]*");
    }

    public static boolean isEmailValid(String email) {
        return email.matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
    }

    public static boolean isPasswordValid(String password) {
        return password.matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$%*?&#!])(?=\\S+$).{8,}$");
    }

    public static boolean isRankValid(int rank) {
        return (rank == 1 || rank == 2);
    }

    public static boolean isVoteValid(String type, List<String> preferences, String voterName) {
        if (type.equals("party")) {
            if (preferences.size() == 6 && isUsernameValid(voterName)) {
                return true;
            }
        } else if (type.equals("candidate")) {
            if (preferences.size() == 12 && isUsernameValid(voterName)) {
                return true;
            }
        }
        return false;
    }
}
