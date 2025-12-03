package com.testmanagementtool.config;

import com.testmanagementtool.model.DropdownOption;
import com.testmanagementtool.repository.DropdownOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
@org.springframework.context.annotation.Profile("!test")
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private DropdownOptionRepository dropdownOptionRepository;

    @Override
    public void run(String... args) throws Exception {
        seedDeviceStatuses();
    }

    private void seedDeviceStatuses() {
        String category = "DEVICE_STATUS";
        List<String> defaults = Arrays.asList(
                "Available",
                "In Use",
                "Broken",
                "Maintenance",
                "Idle inside locker");

        for (String value : defaults) {
            if (!dropdownOptionRepository.existsByCategoryAndValue(category, value)) {
                DropdownOption option = new DropdownOption();
                option.setId(UUID.randomUUID().toString());
                option.setCategory(category);
                option.setValue(value);
                dropdownOptionRepository.save(option);
            }
        }
    }
}
