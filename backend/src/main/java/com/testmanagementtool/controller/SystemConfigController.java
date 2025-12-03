package com.testmanagementtool.controller;

import com.testmanagementtool.model.SystemConfig;
import com.testmanagementtool.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "*")
public class SystemConfigController {

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @GetMapping
    public Map<String, String> getAllConfigs() {
        return systemConfigRepository.findAll().stream()
                .collect(Collectors.toMap(SystemConfig::getKey, SystemConfig::getValue));
    }

    @PostMapping
    public ResponseEntity<SystemConfig> updateConfig(@RequestBody SystemConfig config) {
        return ResponseEntity.ok(systemConfigRepository.save(config));
    }
}
