package com.testmanagementtool.repository;

import com.testmanagementtool.model.Device;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface DeviceRepository extends MongoRepository<Device, UUID> {
}
