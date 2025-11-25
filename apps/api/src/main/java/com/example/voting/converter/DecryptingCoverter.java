package com.example.voting.converter;

import com.example.voting.component.EncryptionUtil;
import com.example.voting.model.ERole;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;

import java.lang.reflect.Field;


@ReadingConverter
public class DecryptingCoverter implements Converter<String, ERole> {


    @Override
    public ERole convert(String source) {
        String decrypted = EncryptionUtil.decrypt(source);
        return ERole.valueOf(decrypted);
    }

}
