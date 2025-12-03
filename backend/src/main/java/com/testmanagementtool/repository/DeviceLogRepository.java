package com.testmanagementtool.repository;

import com.testmanagementtool.model.DeviceLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.UUID;

public interface DeviceLogRepository extends MongoRepository<DeviceLog, UUID> {
    List<DeviceLog> findByDeviceIdOrderByTimestampDesc(UUID deviceId);
}
