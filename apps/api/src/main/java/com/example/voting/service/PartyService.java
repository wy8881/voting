package com.example.voting.service;

import com.example.voting.model.Candidate;
import com.example.voting.model.Party;
import com.example.voting.model.Preference;
import com.example.voting.repositories.CandidateRepository;
import com.example.voting.repositories.PartyRepository;
import com.example.voting.repositories.PreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PartyService {
    @Autowired
    private PartyRepository partyRepository;
    
    @Autowired
    private PreferenceRepository preferenceRepository;
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private MongoTemplate mongoTemplate;

    public boolean partyExistsByName(String name) {
        return partyRepository.existsByName(name);
    }

    public Party createParty(String name, String createdBy) throws RuntimeException {
        if (partyExistsByName(name)) {
            throw new RuntimeException("Error: Party name is already taken!");
        }
        Party party = new Party(name, false, createdBy);
        party.setCandidates(new ArrayList<>());
        return partyRepository.insert(party);
    }

    public List<Party> getAllParties() {
        return partyRepository.findAll();
    }

    public int getPartiesCount() {
        return (int) partyRepository.count();
    }

    @Transactional
    public void deleteParty(String partyName) throws RuntimeException {
        Party party = partyRepository.findByName(partyName);
        if (party == null) {
            throw new RuntimeException("Error: Party not found!");
        }

        if (party.getCandidates() != null) {
            for (String candidateName : party.getCandidates()) {
                try {
                    Candidate candidate = candidateRepository.findByName(candidateName);
                    if (candidate != null) {
                        preferenceRepository.deleteByCandidateName(candidateName);
                        candidateRepository.delete(candidate);
                    }
                } catch (Exception e) {
                    System.err.println("Error deleting candidate " + candidateName + ": " + e.getMessage());
                }
            }
        }

        preferenceRepository.deleteByParty(partyName);

        partyRepository.delete(party);
    }

    public Party getPartyByName(String name) {
        return partyRepository.findByName(name);
    }

    public long countPartiesCreatedBy(String createdBy) {
        return partyRepository.findAll().stream()
                .filter(p -> p.getCreatedBy() != null && p.getCreatedBy().equals(createdBy))
                .filter(p -> !Boolean.TRUE.equals(p.getIsSystemPreset()))
                .count();
    }

    public long countTodayPartiesCreatedBy(String createdBy) {
        LocalDate today = LocalDate.now();
        return partyRepository.findAll().stream()
                .filter(p -> p.getCreatedBy() != null && p.getCreatedBy().equals(createdBy))
                .filter(p -> !Boolean.TRUE.equals(p.getIsSystemPreset()))
                .filter(p -> {
                    if (p.getId() == null) return false;
                    Instant createTime = p.getId().getDate().toInstant();
                    LocalDate createDate = createTime.atZone(ZoneId.systemDefault()).toLocalDate();
                    return createDate.equals(today);
                })
                .count();
    }

    @Transactional
    public void deleteAllNonPresetParties() {
        List<Party> parties = partyRepository.findAll();
        for (Party party : parties) {
            if (!Boolean.TRUE.equals(party.getIsSystemPreset())) {
                try {
                    deleteParty(party.getName());
                } catch (Exception e) {
                    System.err.println("Error deleting party " + party.getName() + ": " + e.getMessage());
                }
            }
        }
    }

    public boolean candidateExistsByName(String name) {
        return candidateRepository.existsByName(name);
    }

    @Transactional
    public void createCandidate(String name, String partyName, int rank, String createdBy) throws RuntimeException {
        if (candidateRepository.existsByName(name)) {
            throw new RuntimeException("Error: The candidate already exist!");
        }
        Candidate candidate = new Candidate(name, partyName, false, createdBy);
        candidateRepository.insert(candidate);
        mongoTemplate.update(Party.class)
                .matching(Criteria.where("name").is(partyName))
                .apply(new Update().push("candidates", name))
                .first();
        if (existsByPartyAndRank(partyName, rank)) {
            throw new RuntimeException("Error: The rank is already taken!");
        }
        createPreference(candidate.getName(), candidate.getParty(), rank);
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public int getCandidatesCount() {
        return (int) candidateRepository.count();
    }

    public boolean existsByPartyAndRank(String party, int rank) {
        Optional<Preference> existingPreference = preferenceRepository.findByPartyAndRank(party, rank);
        return existingPreference.isPresent();
    }

    public void createPreference(String candidateName, String party, int rank) {
        Preference preference = new Preference();
        preference.setCandidateName(candidateName);
        preference.setParty(party);
        preference.setRank(rank);
        preferenceRepository.save(preference);
    }

    @Transactional
    public void deleteCandidate(String candidateName) throws RuntimeException {
        Candidate candidate = candidateRepository.findByName(candidateName);
        if (candidate == null) {
            throw new RuntimeException("Error: Candidate not found!");
        }

        mongoTemplate.update(Party.class)
                .matching(Criteria.where("name").is(candidate.getParty()))
                .apply(new Update().pull("candidates", candidateName))
                .first();

        preferenceRepository.deleteByCandidateName(candidateName);

        candidateRepository.delete(candidate);
    }

    public Candidate getCandidateByName(String name) {
        return candidateRepository.findByName(name);
    }

    public long countCandidatesCreatedBy(String createdBy) {
        return candidateRepository.findAll().stream()
                .filter(c -> c.getCreatedBy() != null && c.getCreatedBy().equals(createdBy))
                .filter(c -> !Boolean.TRUE.equals(c.getIsSystemPreset()))
                .count();
    }

    public long countTodayCandidatesCreatedBy(String createdBy) {
        LocalDate today = LocalDate.now();
        return candidateRepository.findAll().stream()
                .filter(c -> c.getCreatedBy() != null && c.getCreatedBy().equals(createdBy))
                .filter(c -> !Boolean.TRUE.equals(c.getIsSystemPreset()))
                .filter(c -> {
                    if (c.getId() == null) return false;
                    Instant createTime = c.getId().getDate().toInstant();
                    LocalDate createDate = createTime.atZone(ZoneId.systemDefault()).toLocalDate();
                    return createDate.equals(today);
                })
                .count();
    }

    @Transactional
    public void deleteAllNonPresetCandidates() {
        List<Candidate> candidates = candidateRepository.findAll();
        for (Candidate candidate : candidates) {
            if (!Boolean.TRUE.equals(candidate.getIsSystemPreset())) {
                try {
                    deleteCandidate(candidate.getName());
                } catch (Exception e) {
                    System.err.println("Error deleting candidate " + candidate.getName() + ": " + e.getMessage());
                }
            }
        }
    }
}

