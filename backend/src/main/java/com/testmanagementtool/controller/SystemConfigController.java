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

    // Simple in-memory cache
    private Map<String, String> configCache = null;
    private long lastCacheUpdate = 0;
    private static final long CACHE_TTL = 300000; // 5 minutes

    @GetMapping
    public Map<String, String> getAllConfigs() {
        if (configCache != null && System.currentTimeMillis() - lastCacheUpdate < CACHE_TTL) {
            return configCache;
        }

        configCache = repository.findAll().stream()
                .collect(Collectors.toMap(SystemConfig::getKey, SystemConfig::getValue));
        lastCacheUpdate = System.currentTimeMillis();
        return configCache;
    }

    @PostMapping
    public SystemConfig updateConfig(@RequestBody @NonNull SystemConfig config) {
        SystemConfig existing = repository.findByKey(config.getKey());
        SystemConfig saved;
        if (existing != null) {
            existing.setValue(config.getValue());
            saved = repository.save(existing);
        } else {
            saved = repository.save(config);
        }
        // Invalidate cache
        configCache = null;
        return saved;
    }
}
