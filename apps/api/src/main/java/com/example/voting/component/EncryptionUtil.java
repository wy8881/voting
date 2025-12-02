package com.example.voting.component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component
public class EncryptionUtil {
    private static String algorithm = "AES/CBC/PKCS5PADDING";
    @Value("${app.encryption.key}")
    private String key ;

    @Value("${app.encryption.init-vector}")
    private  String initVector;

    public  String encrypt(String value) {
        try{
            IvParameterSpec iv = new IvParameterSpec(decode1Base64(initVector));
            SecretKeySpec skeySpec = new SecretKeySpec(decode1Base64(key), "AES");
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
            byte[] encrypted = cipher.doFinal(value.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public  String decrypt(String encrypted) {
        try{
            IvParameterSpec iv = new IvParameterSpec(decode1Base64(initVector));
            SecretKeySpec skeySpec = new SecretKeySpec(decode1Base64(key), "AES");

            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

            byte[] original = cipher.doFinal(Base64.getDecoder().decode(encrypted));
            return new String(original);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static byte[] decode1Base64(String value) {
        byte[] decodedBytes = Base64.getDecoder().decode(value);

        if (decodedBytes.length != 16) {
            throw new IllegalArgumentException("Decoded byte array is not 16 bytes long");
        }

        return decodedBytes;
    }

}
