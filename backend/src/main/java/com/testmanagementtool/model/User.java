package com.testmanagementtool.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.UUID;

@Data
@Document(collection = "users")
public class User {
    @Id
    private UUID id;
    @org.springframework.data.mongodb.core.index.Indexed(unique = true, sparse = true, background = true)
    private String username;
    private String password;
    private String role;
}
