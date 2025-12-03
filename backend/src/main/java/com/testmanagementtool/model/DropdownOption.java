package com.testmanagementtool.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "dropdown_options")
public class DropdownOption {
    @Id
    private String id;
    private String category; // "ENVIRONMENT" or "ROLE"
    private String value;
}
