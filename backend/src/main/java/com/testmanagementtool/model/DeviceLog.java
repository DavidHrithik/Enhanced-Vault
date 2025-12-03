package com.testmanagementtool.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.UUID;
import java.util.Date;

@Data
@Document(collection = "device_logs")
public class DeviceLog {
    @Id
    private UUID id;
    private UUID deviceId;
    private String action; // CREATED, STATUS_CHANGED, OWNER_CHANGED, DELETED
    private String details; // e.g., "Status changed from Available to In Use"
    private String performedBy; // Username or "System"
    private Date timestamp;
}
