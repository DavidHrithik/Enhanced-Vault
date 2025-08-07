package com.testmanagementtool.service;

import com.testmanagementtool.model.TestAccount;
import com.testmanagementtool.repository.TestAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TestAccountService {
    public List<TestAccount> search(String username, String environment) {
        return getAll().stream()
            .filter(a -> (username == null || a.getUsername().toLowerCase().contains(username.toLowerCase())))
            .filter(a -> (environment == null || environment.isEmpty() || a.getEnvironment().equalsIgnoreCase(environment)))
            .toList();
    }
    @Autowired
    private TestAccountRepository repository;

    public List<TestAccount> getAll() {
        return repository.findAll();
    }

    public Optional<TestAccount> getById(UUID id) {
        return repository.findById(id);
    }

    public TestAccount create(TestAccount account) {
        if (account.getId() == null) {
            account.setId(UUID.randomUUID());
        }
        return repository.save(account);
    }

    public TestAccount update(UUID id, TestAccount updated) {
        updated.setId(id);
        return repository.save(updated);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
