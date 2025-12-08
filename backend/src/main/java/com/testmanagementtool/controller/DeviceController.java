package com.testmanagementtool.controller;

import com.testmanagementtool.model.Device;
import com.testmanagementtool.model.DeviceLog;
import com.testmanagementtool.repository.DeviceRepository;
import com.testmanagementtool.repository.DeviceLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/devices")

public class DeviceController {
    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private DeviceLogRepository deviceLogRepository;

    private void logAction(UUID deviceId, String action, String details) {
        String username = "System";
        try {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            // ignore
        }
        DeviceLog log = new DeviceLog();
        log.setId(UUID.randomUUID());
        log.setDeviceId(deviceId);
        log.setAction(action);
        log.setDetails(details);
        log.setPerformedBy(username);
        log.setTimestamp(new java.util.Date());
        deviceLogRepository.save(log);
    }

    private void logDeviceChange(UUID deviceId, String action, String oldValue, String newValue) {
        String username = "System";
        try {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            // ignore
        }
        DeviceLog log = new DeviceLog();
        log.setId(UUID.randomUUID());
        log.setDeviceId(deviceId);
        log.setAction(action);
        log.setDetails("Changed from '" + oldValue + "' to '" + newValue + "'");
        log.setPerformedBy(username);
        log.setTimestamp(new java.util.Date());
        deviceLogRepository.save(log);
    }

    @GetMapping
    public List<Device> getAllDevices() {
        // This will return all fields, including updatedDate, if present in MongoDB.
        return deviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable @NonNull UUID id) {
        return deviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Device> createDevice(@RequestBody @NonNull Device device) {
        device.setId(UUID.randomUUID());
        if (device.getOwner() == null) {
            device.setOwner("None");
        }
        device.setUpdatedDate(new java.util.Date());
        if (device.getStatus() == null) {
            device.setStatus("Available");
        }
        Device savedDevice = deviceRepository.save(device);

        // Log creation
        logDeviceChange(savedDevice.getId(), "Device Created", "N/A",
                savedDevice.getStatus() != null ? savedDevice.getStatus() : "Available");

        return ResponseEntity.ok(savedDevice);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteDevice(@PathVariable UUID id) {
        deviceRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateDevice(@PathVariable UUID id, @RequestBody Device updated) {
        Optional<Device> deviceOpt = deviceRepository.findById(id);
        if (deviceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Device device = deviceOpt.get();

        String oldOwner = device.getOwner();
        String newOwner = updated.getOwner();
        String oldStatus = device.getStatus();
        String newStatus = updated.getStatus();

        boolean ownerChanged = false;
        boolean statusChanged = false;

        // Update Owner
        if (newOwner != null && !newOwner.equals(oldOwner)) {
            device.setOwner(newOwner);
            ownerChanged = true;
        }

        // Update Status
        if (newStatus != null && !newStatus.equals(oldStatus)) {
            device.setStatus(newStatus);
            statusChanged = true;
        }

        // Auto-update status logic if status wasn't explicitly changed but owner was
        if (ownerChanged && !statusChanged) {
            if (newOwner != null && !newOwner.isEmpty() && (oldOwner == null || oldOwner.isEmpty())) {
                device.setStatus("In Use");
                newStatus = "In Use"; // Update for log
                statusChanged = true;
            } else if ((newOwner == null || newOwner.isEmpty()) && oldOwner != null && !oldOwner.isEmpty()) {
                device.setStatus("Available");
                newStatus = "Available"; // Update for log
                statusChanged = true;
            }
        }

        device.setUpdatedDate(new java.util.Date());
        deviceRepository.save(device);

        if (ownerChanged) {
            logAction(id, "OWNER_CHANGED", "Owner changed from '" + (oldOwner == null ? "" : oldOwner) + "' to '"
                    + (newOwner == null ? "" : newOwner) + "'");
        }

        if (statusChanged) {
            logAction(id, "STATUS_CHANGED", "Status changed from '" + oldStatus + "' to '" + newStatus + "'");
        }

        return ResponseEntity.ok(device);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> payload) {
        Optional<Device> deviceOpt = deviceRepository.findById(id);
        if (deviceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Device device = deviceOpt.get();
        String oldStatus = device.getStatus();
        String newStatus = payload.get("status");

        device.setStatus(newStatus);
        device.setUpdatedDate(new java.util.Date());
        deviceRepository.save(device);

        logAction(id, "STATUS_CHANGED", "Status changed from '" + oldStatus + "' to '" + newStatus + "'");

        return ResponseEntity.ok(device);
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<DeviceLog>> getDeviceLogs(@PathVariable UUID id) {
        return ResponseEntity.ok(deviceLogRepository.findByDeviceIdOrderByTimestampDesc(id));
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
