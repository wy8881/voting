package com.example.voting.model;

import com.example.voting.component.EncryptionUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="logs")
public class Log {
    @Id
    private ObjectId id;
    private String username;
    private String action;

    public Log(String username, String action) {
        this.username = username;
        this.action = action;
    }

    public Log encrypt() {
        return new Log(EncryptionUtil.encrypt(this.username), EncryptionUtil.encrypt(this.action));
    }

    public Log decrypt() {
        return new Log(this.id, EncryptionUtil.decrypt(this.username), EncryptionUtil.decrypt(this.action));
    }



}
