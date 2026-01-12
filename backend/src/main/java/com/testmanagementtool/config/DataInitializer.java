package com.testmanagementtool.config;

import com.testmanagementtool.repository.DropdownOptionRepository;
import com.testmanagementtool.service.DropdownOptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDropdownOptions(DropdownOptionRepository repository, DropdownOptionService service,
            com.testmanagementtool.repository.SystemConfigRepository configRepository) {
        return args -> {
            if (repository.count() == 0) {
                List<String> environments = Arrays.asList("SIT", "QA1", "QA2", "QA3", "QA4", "DEV", "Preprod",
                        "Preprod2");
                List<String> roles = Arrays.asList(
                        "Hospital admin", "Surgeon", "Support Staff", "ICadmin", "IcTechnician",
                        "SN Admin", "SN Manager", "SN Reviewer", "SN CLoud support");

                environments.forEach(env -> service.addOption("ENVIRONMENT", env));
                roles.forEach(role -> service.addOption("ROLE", role));

                logger.info("Initialized default dropdown options.");
            }

            if (configRepository.count() == 0) {
                configRepository.save(
                        new com.testmanagementtool.model.SystemConfig("APP_NAME", "The Vault", "Application Name"));
                logger.info("Initialized default system config.");
            }
        };
    }
}
