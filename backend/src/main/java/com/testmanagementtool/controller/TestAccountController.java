package com.testmanagementtool.controller;

import com.testmanagementtool.model.TestAccount;
import com.testmanagementtool.service.TestAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")

public class TestAccountController {
    @Autowired
    private TestAccountService service;

    @GetMapping("/search")
    public List<TestAccount> search(@RequestParam(required = false) String username,
            @RequestParam(required = false) String environment) {
        return service.search(username, environment);
    }

    @GetMapping
    public List<TestAccount> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestAccount> getById(@PathVariable UUID id) {
        Optional<TestAccount> account = service.getById(id);
        return account.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TestAccount create(@RequestBody TestAccount account) {
        return service.create(account);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestAccount> update(@PathVariable UUID id, @RequestBody TestAccount account) {
        if (!service.getById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.update(id, account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!service.getById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
