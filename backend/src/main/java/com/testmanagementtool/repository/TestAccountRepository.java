package com.testmanagementtool.repository;

import com.testmanagementtool.model.TestAccount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TestAccountRepository extends MongoRepository<TestAccount, UUID> {
    List<TestAccount> findByEnvironment(String environment);

    List<TestAccount> findByRoleContaining(String role);
}
