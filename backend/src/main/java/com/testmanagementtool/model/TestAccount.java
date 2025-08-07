package com.testmanagementtool.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.UUID;

@Data
@Document(collection = "test_accounts")
public class TestAccount {
    @Id
    private UUID id;
    private String username;
    // This field is now shown in the UI with an eye icon
    private String password;
    private String environment; // DEV, QA, UAT, PROD
    private String owner;
    private List<String> role;
    private String remarks;
}
