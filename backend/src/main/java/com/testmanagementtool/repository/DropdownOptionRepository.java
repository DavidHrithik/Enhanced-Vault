package com.testmanagementtool.repository;

import com.testmanagementtool.model.DropdownOption;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DropdownOptionRepository extends MongoRepository<DropdownOption, String> {
    List<DropdownOption> findByCategory(String category);

    // Ordered fetch
    List<DropdownOption> findByCategoryOrderByDisplayOrderAsc(String category);

    boolean existsByCategoryAndValue(String category, String value);
}
