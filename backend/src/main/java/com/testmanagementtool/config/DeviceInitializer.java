package com.testmanagementtool.config;

import com.testmanagementtool.model.Device;
import com.testmanagementtool.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.UUID;

@Configuration
public class DeviceInitializer implements CommandLineRunner {
    @Autowired
    private DeviceRepository deviceRepository;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) {
        if (deviceRepository.count() == 0) {
            deviceRepository.saveAll(List.of(
                    newDevice("MACBook Air M2", "Alice"),
                    newDevice("MACBook Air M2", "Bob"),
                    newDevice("MACBook Air M2", "Charlie"),
                    newDevice("IPhone12", "David"),
                    newDevice("IPhone13", "Emma"),
                    newDevice("Galaxy", "Frank"),
                    newDevice("Galaxy", "Grace"),
                    newDevice("Intellio Tablet", "Helen"),
                    newDevice("Intellio Tablet", "Ivan"),
                    newDevice("Intellio Tablet", "Judy"),
                    newDevice("Ipad Air2", "Kevin"),
                    newDevice("Ipad Air2", "Laura"),
                    newDevice("Ipad Air2", "Mallory"),
                    newDevice("NOKIA Phone", "Nina"),
                    newDevice("NOKIA Phone", "Oscar"),
                    newDevice("NOKIA Phone", "Paul"),
                    newDevice("NOKIA Phone", "Quinn"),
                    newDevice("NOKIA Phone", "Rita")));
        }
    }

    private Device newDevice(String model, String owner) {
        Device d = new Device();
        d.setId(UUID.randomUUID());
        d.setModel(model);
        d.setOwner(owner);
        d.setUpdatedDate(null);
        return d;
    }
}
