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

    public List<TestAccount> search(String username, String environment) {
        if (username != null && environment != null) {
            return repository.findByUsernameContainingAndEnvironment(username, environment);
        } else if (username != null) {
            return repository.findByUsernameContaining(username);
        } else if (environment != null) {
            return repository.findByEnvironment(environment);
        } else {
            return repository.findAll();
        }
    }

    public List<TestAccount> getAll() {
        return repository.findAll();
    }

    public Optional<TestAccount> getById(@NonNull UUID id) {
        return repository.findById(id);
    }

    public TestAccount create(TestAccount account) {
        return repository.save(account);
    }

    public TestAccount update(@NonNull UUID id, TestAccount account) {
        account.setId(id);
        return repository.save(account);
    }

    public void delete(@NonNull UUID id) {
        repository.deleteById(id);
    }
}
