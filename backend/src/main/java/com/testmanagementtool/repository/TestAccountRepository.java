package com.testmanagementtool.repository;

import com.testmanagementtool.model.TestAccount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TestAccountRepository extends MongoRepository<TestAccount, UUID> {
    // Custom query methods can be added here if needed
}
