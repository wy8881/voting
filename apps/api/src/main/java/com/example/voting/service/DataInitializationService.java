package com.example.voting.service;

import com.example.voting.model.*;
import com.example.voting.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializationService {

    @Autowired
    private UserService userService;
    
    @Autowired
    private PartyService partyService;

    @Autowired
    private PartyRepository partyRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Value("${app.db.reset.fixed-account-password}")
    private String fixedAccountPassword;

    private static final String DEMO_PASSWORD = "2qmbWuNHy!HI";

    public void initializePresetData() {
        initializePresetParties();
        initializePresetCandidates();
    }

    private void initializePresetParties() {
        List<String> presetParties = Arrays.asList(
            "Feline Progressive Party",
            "Canine Unity Party",
            "Avian Freedom Party"
        );

        for (String partyName : presetParties) {
            if (!partyService.partyExistsByName(partyName)) {
                Party party = new Party(partyName, true, "SYSTEM");
                party.setCandidates(new ArrayList<>());
                partyRepository.save(party);
            }
        }
    }

    private void initializePresetCandidates() {
        List<PresetCandidate> presetCandidates = Arrays.asList(
            new PresetCandidate("Mira Softpaws", "Feline Progressive Party", 1),
            new PresetCandidate("Leon Whiskerborn", "Feline Progressive Party", 2),
            new PresetCandidate("Rex Strongpaw", "Canine Unity Party", 1),
            new PresetCandidate("Bella Barkwell", "Canine Unity Party", 2),
            new PresetCandidate("Orion Feathercrest", "Avian Freedom Party", 1),
            new PresetCandidate("Lyria Skysong", "Avian Freedom Party", 2)
        );

        for (PresetCandidate preset : presetCandidates) {
            if (!partyService.candidateExistsByName(preset.name)) {
                try {
                    Candidate candidate = new Candidate(preset.name, preset.party, true, "SYSTEM");
                    candidateRepository.save(candidate);
                    
                    Party party = partyRepository.findByName(preset.party);
                    if (party != null) {
                        if (party.getCandidates() == null) {
                            party.setCandidates(new ArrayList<>());
                        }
                        if (!party.getCandidates().contains(preset.name)) {
                            party.getCandidates().add(preset.name);
                            partyRepository.save(party);
                        }
                    }
                    
                    if (!partyService.existsByPartyAndRank(preset.party, preset.rank)) {
                        partyService.createPreference(preset.name, preset.party, preset.rank);
                    }
                } catch (Exception e) {
                    System.err.println("Error creating preset candidate " + preset.name + ": " + e.getMessage());
                }
            }
        }
    }

    public void initializeFixedAccountsAfterReset() {
        if (fixedAccountPassword == null || fixedAccountPassword.trim().isEmpty()) {
            throw new IllegalStateException("app.db.reset.fixed-account-password (or FIXED_ACCOUNT_PASSWORD environment variable) is required but not set");
        }
        
        createAccount("voter", "voter@gmail.com", fixedAccountPassword, ERole.ROLE_VOTER, false);
        createAccount("delegate", "delegate@gmail.com", fixedAccountPassword, ERole.ROLE_DELEGATE, false);
        createAccount("admin", "admin@gmail.com", fixedAccountPassword, ERole.ROLE_ADMIN, false);
        
        createAccount("voterdemo", "voter_demo@gmail.com", DEMO_PASSWORD, ERole.ROLE_VOTER, true);
        createAccount("delegatedemo", "delegate_demo@gmail.com", DEMO_PASSWORD, ERole.ROLE_DELEGATE, true);
        createAccount("admindemo", "admin_demo@gmail.com", DEMO_PASSWORD, ERole.ROLE_ADMIN, true);
    }

    private void createAccount(String username, String email, String password, ERole role, boolean isDemo) {
        User user = new User(username, email, password);
        user.setRole(role);
        user.setIsDemoAccount(isDemo);
        userService.createUser(user);
        System.out.println("Created account: " + username);
    }

    private static class PresetCandidate {
        String name;
        String party;
        int rank;

        PresetCandidate(String name, String party, int rank) {
            this.name = name;
            this.party = party;
            this.rank = rank;
        }
    }
}

