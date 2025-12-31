package com.testmanagementtool.service;

import com.testmanagementtool.model.TestAccount;
import com.testmanagementtool.repository.TestAccountRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentCaptor.forClass;

@SpringBootTest(classes = { TestAccountService.class,
        CryptoService.class }, properties = "encryption.secret=MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=")
@SuppressWarnings("null")
public class TestAccountEncryptionTest {

    @Autowired
    private TestAccountService service;

    @MockBean
    private TestAccountRepository repository;

    @Test
    public void testCreateEncryptsPassword() {
        TestAccount account = new TestAccount();
        account.setUsername("user");
        account.setPassword("plainTextPassword");
        account.setEnvironment("DEV");

        when(repository.save(any(TestAccount.class))).thenAnswer(i -> i.getArguments()[0]);

        service.create(account);

        var captor = forClass(TestAccount.class);
        verify(repository).save(captor.capture());

        TestAccount savedAccount = captor.getValue();
        assertNotEquals("plainTextPassword", savedAccount.getPassword());

        // Decrypt manually to verify
        // service.decryptPassword is private, checking via getById is better
        // integration test
    }
}
