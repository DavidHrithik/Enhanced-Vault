package com.testmanagementtool.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.UUID;

@Data
@lombok.EqualsAndHashCode(callSuper = true)
@Document(collection = "test_accounts")
public class TestAccount extends BaseEntity {
    @Id
    private UUID id;
    @jakarta.validation.constraints.NotBlank(message = "Username is required")
    private String username;
    // This field is now shown in the UI with an eye icon
    private String password;
    @jakarta.validation.constraints.NotBlank(message = "Environment is required")
    private String environment; // DEV, QA, UAT, PROD
    private String owner;
    private List<String> role;
    private String remarks;
}
