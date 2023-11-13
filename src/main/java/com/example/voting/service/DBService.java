package com.example.voting.service;

import com.example.voting.model.*;
import com.example.voting.payload.response.MessageResponse;
import com.example.voting.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


@Service
public class DBService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VoterRepository voterRepository;
    @Autowired
    private BallotRepository  ballotRepository;
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private PartyRepository partyRepository;
    @Autowired
    private PreferenceRepository preferenceRepository;
    @Autowired
    private VoteRespository voteRespository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean candidateExistsByName(String name) {
        return candidateRepository.existsByName(name);
    }

    public boolean partyExistsByName(String name) {
        return partyRepository.existsByName(name);
    }

    public void createUser(User user) {

        userRepository.save(user.encrypt());
    }
    @Transactional
    public void createVoter(User user) throws RuntimeException{
        if (existsByUsername(user.getUsername()) || voterRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        userRepository.save(user);
        voterRepository.save(new Voter(user.getUsername(), UUID.randomUUID().toString()));
    }
    public boolean hasVote(String username) {
        Voter voter = voterRepository.findByUsername(username);
        return voter.isVoted();
    }

    public List<String> convert2Candidates(List<String> Parties) throws RuntimeException {
        List<String> candidates = new ArrayList<>();
        for (String party : Parties) {
            for(int i = 2; i > 0; i--) {
                Optional<Preference> preference = preferenceRepository.findByPartyAndRank(party, i);
                if(preference.isPresent()) {
                    candidates.add(preference.get().getCandidateName());
                }
                else{
                    throw new RuntimeException("Vote failed");
                }
            }
        }
        return candidates;
    }
    @Transactional
    public void vote(List<String> preferences, String username, String type) throws RuntimeException{
        Voter voter = voterRepository.findByUsername(username);
        if(voter == null){
            throw new RuntimeException("Voter does not exist");
        }
        String anonymousId = voter.getAnonymousId();
        if(anonymousId == null || anonymousId.isEmpty()) {
            anonymousId = UUID.randomUUID().toString();
            voter.setAnonymousId(anonymousId);
            voterRepository.save(voter);
        }
        Ballot ballot = ballotRepository.insert(new Ballot(anonymousId,preferences, type));
        if(type.equals("party")) {
            preferences = convert2Candidates(preferences);
        }
        if(hasVote(username)) {
            throw new RuntimeException("You have already voted");
        }
        mongoTemplate.update(Voter.class)
                .matching(Criteria.where("username").is(username))
                .apply(new Update().set("voted", true))
                .first();
        int size = preferences.size();
        for(int i = 0; i < size; i++) {
            Vote vote = new Vote(preferences.get(i), size - i);
            if(!candidateRepository.existsByName(preferences.get(i))) {
                throw new RuntimeException("Candidate does not exist");
            }
            Vote newVote = voteRespository.insert(vote);
            mongoTemplate.update(Vote.class)
                    .matching(Criteria.where("id").is(newVote.getId()))
                    .apply(new Update().set("ballot", ballot))
                    .first();
        }
    }

    @Transactional
    public void createCandidate(String name, String partyName, int rank) throws RuntimeException {
        if(candidateRepository.existsByName(name)) throw new RuntimeException("Error: The candidate already exist!");
        candidateRepository.insert(new Candidate(name, partyName));
        mongoTemplate.update(Party.class)
                .matching(Criteria.where("name").is(partyName))
                .apply(new Update().push("candidates", name))
                .first();
        if(existsByPartyAndRank(partyName, rank)) throw new RuntimeException("Error: The rank is already taken!");
        Candidate candidate = candidateRepository.findByName(name);
        createPreference(candidate.getName(), candidate.getParty(), rank);

    }

    public Party createParty(String name) throws RuntimeException{
        if(partyExistsByName(name)) throw new RuntimeException("Error: Party name is already taken!");
        return partyRepository.insert(new Party(name));
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public List<Party> getAllParties() {
        return partyRepository.findAll();
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

    public List<CandidateTotalVote> candidateTotalVotes() {
        List<Vote> votes = mongoTemplate.findAll(Vote.class, "votes");
        Collections.shuffle(votes);
        String tempCollectionName = "shuffledVotes";
        mongoTemplate.dropCollection(tempCollectionName);
        mongoTemplate.insert(votes, tempCollectionName);


        LookupOperation lookupOperation = LookupOperation.newLookup()
                .from("shuffledVotes")
                .localField("name")
                .foreignField("candidateName")
                .as("votesInfo");

        UnwindOperation unwindOperation = Aggregation.unwind("votesInfo", true);

        GroupOperation groupOperation = Aggregation.group("name")
                .sum("votesInfo.num").as("totalVotes");

        ProjectionOperation projectionOperation = Aggregation.project()
                .and("_id").as("candidateName")
                .andInclude("totalVotes");

        Aggregation aggregation = Aggregation.newAggregation(
                lookupOperation,
                unwindOperation,
                groupOperation,
                projectionOperation
        );

        AggregationResults<CandidateTotalVote> results = mongoTemplate.aggregate(
                aggregation,
                "candidates",
                CandidateTotalVote.class
        );

        return results.getMappedResults();
    }


}
