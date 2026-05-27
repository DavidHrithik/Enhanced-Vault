package com.testmanagementtool.service;

import com.testmanagementtool.model.Device;
import com.testmanagementtool.model.DeviceLog;
import com.testmanagementtool.repository.DeviceLogRepository;
import com.testmanagementtool.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private DeviceLogRepository deviceLogRepository;

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public java.util.Map<String, Object> getDeviceStats() {
        List<Device> devices = deviceRepository.findAll();

        // Status counts
        java.util.Map<String, Long> statusCounts = devices.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        d -> d.getStatus() != null ? d.getStatus() : "Unknown",
                        java.util.stream.Collectors.counting()));

        // Owner counts (top 5)
        java.util.Map<String, Long> ownerCounts = devices.stream()
                .filter(d -> d.getOwner() != null && !d.getOwner().isEmpty() && !d.getOwner().equalsIgnoreCase("None"))
                .collect(java.util.stream.Collectors.groupingBy(
                        Device::getOwner,
                        java.util.stream.Collectors.counting()));

        // Provide top 5 owners
        java.util.Map<String, Long> topOwners = ownerCounts.entrySet().stream()
                .sorted(java.util.Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(java.util.stream.Collectors.toMap(
                        java.util.Map.Entry::getKey,
                        java.util.Map.Entry::getValue,
                        (e1, e2) -> e1,
                        java.util.LinkedHashMap::new));

        // Calculate possession metrics
        long now = new java.util.Date().getTime();
        List<java.util.Map<String, Object>> devicePossessions = devices.stream()
                .filter(d -> d.getOwner() != null && !d.getOwner().isEmpty() && !d.getOwner().equalsIgnoreCase("None"))
                .map(d -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("model", d.getModel());
                    map.put("owner", d.getOwner());
                    java.util.Date startDate = d.getLastAssignedDate() != null ? d.getLastAssignedDate()
                            : d.getUpdatedDate();
                    map.put("assignedDate", startDate);

                    if (startDate != null) {
                        long diffInMillies = Math.abs(now - startDate.getTime());
                        long diff = java.util.concurrent.TimeUnit.DAYS.convert(diffInMillies,
                                java.util.concurrent.TimeUnit.MILLISECONDS);
                        map.put("daysHeld", diff);
                    } else {
                        map.put("daysHeld", 0L);
                    }
                    return map;
                })
                .sorted((m1, m2) -> {
                    java.util.Date d1 = (java.util.Date) m1.get("assignedDate");
                    java.util.Date d2 = (java.util.Date) m2.get("assignedDate");
                    // Sort by most recent assignment (descending)
                    if (d1 == null && d2 == null) {
                        return 0;
                    }
                    if (d1 == null) {
                        return 1;
                    }
                    if (d2 == null) {
                        return -1;
                    }
                    return d2.compareTo(d1);
                })
                .collect(java.util.stream.Collectors.toList());

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalDevices", devices.size());
        stats.put("statusCounts", statusCounts);
        stats.put("topOwners", topOwners);
        stats.put("devicePossessions", devicePossessions);

        return stats;
    }

    public Optional<Device> getDeviceById(@NonNull UUID id) {
        return deviceRepository.findById(id);
    }

    public Device createDevice(@NonNull Device device) {
        device.setId(UUID.randomUUID());
        if (device.getOwner() == null) {
            device.setOwner("None");
        }
        if (device.getOwner() != null && !device.getOwner().isEmpty() && !device.getOwner().equalsIgnoreCase("None")) {
            device.setLastAssignedDate(new java.util.Date());
        }
        device.setUpdatedDate(new java.util.Date());
        if (device.getStatus() == null) {
            device.setStatus("Available");
        }
        Device savedDevice = deviceRepository.save(device);

        // Log creation
        logDeviceChange(savedDevice.getId(), "Device Created", "N/A",
                savedDevice.getStatus() != null ? savedDevice.getStatus() : "Available");

        return savedDevice;
    }

    public void deleteDevice(@NonNull UUID id) {
        deviceRepository.deleteById(id);
    }

    public Optional<Device> updateDevice(@NonNull UUID id, Device updated) {
        Optional<Device> deviceOpt = deviceRepository.findById(id);
        if (deviceOpt.isEmpty()) {
            return Optional.empty();
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
            // Update last assigned date if acquiring a new owner
            if (!newOwner.isEmpty() && !newOwner.equalsIgnoreCase("None")) {
                device.setLastAssignedDate(new java.util.Date());
            } else {
                // If owner is removed, clear the assigned date
                device.setLastAssignedDate(null);
            }
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
        Device savedDevice = deviceRepository.save(device);

        if (ownerChanged) {
            logAction(id, "OWNER_CHANGED", "Owner changed from '" + (oldOwner == null ? "" : oldOwner) + "' to '"
                    + (newOwner == null ? "" : newOwner) + "'");
        }

        if (statusChanged) {
            logAction(id, "STATUS_CHANGED", "Status changed from '" + oldStatus + "' to '" + newStatus + "'");
        }

        return Optional.of(savedDevice);
    }

    public Optional<Device> updateStatus(@NonNull UUID id, String newStatus) {
        Optional<Device> deviceOpt = deviceRepository.findById(id);
        if (deviceOpt.isEmpty()) {
            return Optional.empty();
        }
        Device device = deviceOpt.get();
        String oldStatus = device.getStatus();

        device.setStatus(newStatus);
        device.setUpdatedDate(new java.util.Date());
        Device savedDevice = deviceRepository.save(device);

        logAction(id, "STATUS_CHANGED", "Status changed from '" + oldStatus + "' to '" + newStatus + "'");

        return Optional.of(savedDevice);
    }

    public List<DeviceLog> getDeviceLogs(UUID id) {
        return deviceLogRepository.findByDeviceIdOrderByTimestampDesc(id);
    }

    public int bulkUpdateUpdatedDate() {
        List<Device> devices = deviceRepository.findAll();
        List<Device> toUpdate = new java.util.ArrayList<>();
        for (Device d : devices) {
            if (d.getUpdatedDate() == null) {
                d.setUpdatedDate(new java.util.Date());
                toUpdate.add(d);
            }
        }
        if (!toUpdate.isEmpty()) {
            deviceRepository.saveAll(toUpdate);
        }
        return toUpdate.size();
    }

    private void logAction(UUID deviceId, String action, String details) {
        String username = "System";
        try {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            System.err.println("Error getting current user: " + e.getMessage());
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
            System.err.println("Error getting current user: " + e.getMessage());
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
}
