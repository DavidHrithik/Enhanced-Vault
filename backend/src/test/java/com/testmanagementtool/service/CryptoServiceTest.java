package com.testmanagementtool.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = CryptoService.class)
public class CryptoServiceTest {

    @Autowired
    private CryptoService cryptoService;

    @Test
    public void testEncryptDecrypt() {
        String originalText = "SecretPassword123";
        String encryptedText = cryptoService.encrypt(originalText);

        assertNotNull(encryptedText);
        assertNotEquals(originalText, encryptedText);

        String decryptedText = cryptoService.decrypt(encryptedText);
        assertEquals(originalText, decryptedText);
    }

    @Test
    public void testEncryptStability() {
        // GCM with random IV produces different output for same input
        String text = "Test";
        String enc1 = cryptoService.encrypt(text);
        String enc2 = cryptoService.encrypt(text);

        assertNotEquals(enc1, enc2);

        assertEquals(text, cryptoService.decrypt(enc1));
        assertEquals(text, cryptoService.decrypt(enc2));
    }
}
