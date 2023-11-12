package com.example.voting.utils;

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
        return password.matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$");
    }

    public static boolean isRankValid(int rank) {
        return (rank == 1 || rank == 2);
    }
}
