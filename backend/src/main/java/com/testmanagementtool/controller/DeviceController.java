package com.testmanagementtool.controller;

import com.testmanagementtool.model.Device;
import com.testmanagementtool.model.DeviceLog;
import com.testmanagementtool.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private DeviceService deviceService;

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable @NonNull UUID id) {
        return deviceService.getDeviceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Device> createDevice(@RequestBody @NonNull Device device) {
        Device savedDevice = deviceService.createDevice(device);
        return ResponseEntity.ok(savedDevice);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteDevice(@PathVariable @NonNull UUID id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateDevice(@PathVariable @NonNull UUID id, @RequestBody Device updated) {
        Optional<Device> saved = deviceService.updateDevice(id, updated);
        if (saved.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved.get());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable @NonNull UUID id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        Optional<Device> saved = deviceService.updateStatus(id, newStatus);
        if (saved.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved.get());
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<DeviceLog>> getDeviceLogs(@PathVariable UUID id) {
        return ResponseEntity.ok(deviceService.getDeviceLogs(id));
    }

    // Bulk update endpoint to set updatedDate for all devices
    @PutMapping("/bulk-update-updated-date")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> bulkUpdateUpdatedDate() {
        int updatedCount = deviceService.bulkUpdateUpdatedDate();
        return ResponseEntity.ok(Map.of("updated", updatedCount));
    }
}
