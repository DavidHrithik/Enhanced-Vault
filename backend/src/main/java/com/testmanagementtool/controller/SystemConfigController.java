package com.testmanagementtool.controller;

import com.testmanagementtool.model.SystemConfig;
import com.testmanagementtool.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/config")
public class SystemConfigController {
    @Autowired
    private SystemConfigRepository repository;

    @GetMapping
    public Map<String, String> getAllConfigs() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(SystemConfig::getKey, SystemConfig::getValue));
    }

    @PostMapping
    public SystemConfig updateConfig(@RequestBody @NonNull SystemConfig config) {
        SystemConfig existing = repository.findByKey(config.getKey());
        if (existing != null) {
            existing.setValue(config.getValue());
            return repository.save(existing);
        }
        return repository.save(config);
    }
}
