package com.testmanagementtool.repository;

import com.testmanagementtool.model.SystemConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemConfigRepository extends MongoRepository<SystemConfig, String> {
}
