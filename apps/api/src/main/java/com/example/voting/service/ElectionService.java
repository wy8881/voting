package com.example.voting.service;

import com.example.voting.dto.common.CandidateTotalVote;
import com.example.voting.dto.response.ElectionResultResponse;
import com.example.voting.model.*;
import com.example.voting.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ElectionService {
    
    @Value("${app.db.reset.enabled:true}")
    private boolean dbResetEnabled;
    @Autowired
    private ElectionStatusRepository electionStatusRepository;
    
    @Autowired
    private ElectionResultRepository electionResultRepository;
    
    @Autowired
    private VoteRespository voteRespository;
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VoterRepository voterRepository;
    
    @Autowired
    private BallotRepository ballotRepository;
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private PartyRepository partyRepository;
    
    @Autowired
    private PreferenceRepository preferenceRepository;
    
    @Autowired
    private LogRepository logRepository;

    public void resetDatabase(DataInitializationService dataInitializationService) {
        if (!dbResetEnabled) {
            return;
        }
        deleteAllData();
        dataInitializationService.initializePresetData();
        dataInitializationService.initializeFixedAccountsAfterReset();
        startElection();
    }

    public Optional<ElectionStatus> getLatestElectionStatus() {
        return electionStatusRepository.findFirstByOrderByStatusUpatedTimeDesc();
    }

    public ElectionStatus saveElectionStatus(@NonNull ElectionStatus electionStatus) {
        ElectionStatus saved = electionStatusRepository.save(electionStatus);
        return Objects.requireNonNull(saved, "Failed to save election status");
    }

    public boolean isElectionStarted() {
        Optional<ElectionStatus> latestStatus = getLatestElectionStatus();
        return latestStatus.map(ElectionStatus::isElectionStarted).orElse(false);
    }

    public void startElection() {
        ElectionStatus electionStatus = new ElectionStatus();
        electionStatus.setElectionStarted(true);
        electionStatus.setStatusUpatedTime(LocalDateTime.now());
        saveElectionStatus(electionStatus);
    }

    public void stopElection() {
        ElectionStatus electionStatus = new ElectionStatus();
        electionStatus.setElectionStarted(false);
        electionStatus.setStatusUpatedTime(LocalDateTime.now());
        saveElectionStatus(electionStatus);
    }

    public ElectionResultResponse candidateTotalVotes() {
        List<Vote> votes = mongoTemplate.findAll(Vote.class, "votes");
        Collections.shuffle(votes);
        Map<String, Long> voteCounts = votes.stream()
                .collect(Collectors.groupingBy(Vote::getCandidateName, Collectors.summingLong(Vote::getNum)));
        List<CandidateTotalVote> candidateTotalVotes = voteCounts.entrySet().stream()
                .map(entry -> new CandidateTotalVote(entry.getKey(), entry.getValue()))
                .toList();
        
        LocalDateTime now = LocalDateTime.now();
        
        ElectionResult electionResult = new ElectionResult();
        electionResult.setCandidateTotalVotes(candidateTotalVotes);
        electionResult.setLastCalculatedAt(now);
        
        electionResultRepository.save(electionResult);
        
        ElectionResultResponse response = new ElectionResultResponse();
        response.setCandidateTotalVotes(candidateTotalVotes);
        response.setLastCalculatedAt(now);
        return response;
    }

    public ElectionResultResponse getLatestElectionResult() throws RuntimeException {
        if (isElectionStarted()) {
            throw new RuntimeException("Election has not ended yet. Results are not available.");
        }
        Optional<ElectionResult> latestResult = electionResultRepository.findFirstByOrderByLastCalculatedAtDesc();
        if (latestResult.isEmpty()) {
            throw new RuntimeException("No election results available.");
        }
        ElectionResult result = latestResult.get();
        ElectionResultResponse response = new ElectionResultResponse();
        response.setCandidateTotalVotes(result.getCandidateTotalVotes());
        response.setLastCalculatedAt(result.getLastCalculatedAt());
        return response;
    }

    @Transactional
    public void deleteAllData() {
        userRepository.deleteAll();
        voterRepository.deleteAll();
        ballotRepository.deleteAll();
        candidateRepository.deleteAll();
        partyRepository.deleteAll();
        preferenceRepository.deleteAll();
        voteRespository.deleteAll();
        electionStatusRepository.deleteAll();
        electionResultRepository.deleteAll();
        logRepository.deleteAll();
    }
}

