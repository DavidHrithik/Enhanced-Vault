package com.testmanagementtool.controller;

import com.testmanagementtool.model.Device;
import com.testmanagementtool.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "http://localhost:3000")
public class DeviceController {
    @Autowired
    private DeviceRepository deviceRepository;

    @GetMapping
    public List<Device> getAll() {
        // This will return all fields, including updatedDate, if present in MongoDB.
        return deviceRepository.findAll();
    }

    @PutMapping("/{id}/owner")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateOwner(@PathVariable UUID id, @RequestBody Device updated) {
        Optional<Device> deviceOpt = deviceRepository.findById(id);
        if (deviceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Device device = deviceOpt.get();
        device.setOwner(updated.getOwner());
        device.setUpdatedDate(new java.util.Date());
        deviceRepository.save(device);
        return ResponseEntity.ok(device);
    }

    // Bulk update endpoint to set updatedDate for all devices
    @PutMapping("/bulk-update-updated-date")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> bulkUpdateUpdatedDate() {
        List<Device> devices = deviceRepository.findAll();
        int updated = 0;
        for (Device d : devices) {
            if (d.getUpdatedDate() == null) {
                d.setUpdatedDate(new java.util.Date());
                deviceRepository.save(d);
                updated++;
            }
        }
        return ResponseEntity.ok(Map.of("updated", updated));
    }
}
