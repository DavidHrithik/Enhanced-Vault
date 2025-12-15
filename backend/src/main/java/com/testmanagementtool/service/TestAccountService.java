package com.testmanagementtool.service;

import com.testmanagementtool.model.TestAccount;
import com.testmanagementtool.repository.TestAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TestAccountService {
    @Autowired
    private TestAccountRepository repository;

    @Autowired
    private CryptoService cryptoService;

    public List<TestAccount> search(String username, String environment) {
        List<TestAccount> accounts;
        if (username != null && environment != null) {
            accounts = repository.findByUsernameContainingAndEnvironment(username, environment);
        } else if (username != null) {
            accounts = repository.findByUsernameContaining(username);
        } else if (environment != null) {
            accounts = repository.findByEnvironment(environment);
        } else {
            accounts = repository.findAll();
        }
        accounts.forEach(this::decryptPassword);
        return accounts;
    }

    public List<TestAccount> getAll() {
        List<TestAccount> accounts = repository.findAll();
        accounts.forEach(this::decryptPassword);
        return accounts;
    }

    public Optional<TestAccount> getById(@NonNull UUID id) {
        Optional<TestAccount> account = repository.findById(id);
        account.ifPresent(this::decryptPassword);
        return account;
    }

    @SuppressWarnings("null")
    public TestAccount create(TestAccount account) {
        if (account.getId() == null) {
            account.setId(UUID.randomUUID());
        }
        encryptPassword(account);
        return repository.save(account);
    }

    public TestAccount update(@NonNull UUID id, TestAccount account) {
        account.setId(id);
        encryptPassword(account);
        return repository.save(account);
    }

    private void encryptPassword(TestAccount account) {
        if (account.getPassword() != null) {
            account.setPassword(cryptoService.encrypt(account.getPassword()));
        }
    }

    private void decryptPassword(TestAccount account) {
        if (account.getPassword() != null) {
            try {
                account.setPassword(cryptoService.decrypt(account.getPassword()));
            } catch (Exception e) {
                // Ignore decryption errors for now (e.g. legacy data)
                // Or log it
            }
        }
    }

    public void delete(@NonNull UUID id) {
        repository.deleteById(id);
    }
}
