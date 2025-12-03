package com.testmanagementtool.controller;

import com.testmanagementtool.model.DropdownOption;
import com.testmanagementtool.service.DropdownOptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/options")
public class DropdownOptionController {

    @Autowired
    private DropdownOptionService service;

    @GetMapping("/{category}")
    public ResponseEntity<List<DropdownOption>> getOptions(@PathVariable String category) {
        return ResponseEntity.ok(service.getOptions(category));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DropdownOption> addOption(@RequestBody Map<String, String> payload) {
        String category = payload.get("category");
        String value = payload.get("value");
        return ResponseEntity.ok(service.addOption(category, value));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOption(@PathVariable String id) {
        service.deleteOption(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DropdownOption> updateOption(@PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String newValue = payload.get("value");
        return ResponseEntity.ok(service.updateOption(id, newValue));
    }
}
