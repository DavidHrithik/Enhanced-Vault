package com.testmanagementtool.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.UUID;

@Data
@Document(collection = "test_datasets")
public class TestDataset {
    @Id
    private UUID id;
    private String name;
    private List<String> data;
}
