package com.example.voting.converter;

import com.example.voting.component.EncryptionUtil;
import com.example.voting.model.ERole;
import org.springframework.core.convert.converter.Converter;
import java.util.logging.Logger;

import org.springframework.data.convert.WritingConverter;


@WritingConverter
public class EncryptConverter implements Converter<ERole, String> {

    Logger logger = Logger.getLogger(EncryptConverter.class.getName());


    @Override
    public String convert(ERole source) {
        return EncryptionUtil.encrypt(source.toString());
    }

}
