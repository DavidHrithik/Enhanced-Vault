package com.testmanagementtool.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.UUID;

@Data
@Document(collection = "devices")
public class Device {
    @Id
    private UUID id;
    private String model;
    private String owner;
    private java.util.Date updatedDate;
    private String status; // Available, In Use, Broken, Maintenance
}
