package com.testmanagementtool.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "system_config")
public class SystemConfig {
    @Id
    private String key; // e.g., "APP_NAME"
    private String value; // e.g., "The Vault"
    private String description; // Optional description
}
