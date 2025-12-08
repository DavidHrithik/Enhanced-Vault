package com.testmanagementtool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testmanagementtool.model.Device;
import com.testmanagementtool.repository.DeviceLogRepository;
import com.testmanagementtool.repository.DeviceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class DeviceControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @org.springframework.boot.test.mock.mockito.MockBean
        private DeviceRepository deviceRepository;

        @org.springframework.boot.test.mock.mockito.MockBean
        private DeviceLogRepository deviceLogRepository;

        @Autowired
        private ObjectMapper objectMapper;

        @BeforeEach
        public void setup() {
                // Mocks are reset automatically by @MockBean
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        public void testCreateDeviceCreatesLog() throws Exception {
                Device device = new Device();
                device.setModel("Test Device");
                device.setOwner("None");

                Device savedDevice = new Device();
                savedDevice.setId(UUID.randomUUID());
                savedDevice.setModel("Test Device");
                savedDevice.setOwner("None");
                savedDevice.setStatus("Available");

                org.mockito.Mockito.when(deviceRepository.save(org.mockito.ArgumentMatchers.any(Device.class)))
                                .thenReturn(savedDevice);

                mockMvc.perform(post("/api/devices")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(device)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value("Available"));

                org.mockito.Mockito.verify(deviceLogRepository, org.mockito.Mockito.times(1))
                                .save(org.mockito.ArgumentMatchers.any(com.testmanagementtool.model.DeviceLog.class));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        public void testUpdateOwnerUpdatesStatusAndLog() throws Exception {
                UUID id = UUID.randomUUID();
                Device device = new Device();
                device.setId(id);
                device.setModel("Test Device");
                device.setStatus("Available");

                org.mockito.Mockito.when(deviceRepository.findById(id)).thenReturn(java.util.Optional.of(device));
                org.mockito.Mockito.when(deviceRepository.save(org.mockito.ArgumentMatchers.any(Device.class)))
                                .thenAnswer(i -> i.getArguments()[0]);

                Device update = new Device();
                update.setOwner("New Owner");

                mockMvc.perform(put("/api/devices/" + id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(update)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value("In Use"));

                org.mockito.Mockito.verify(deviceLogRepository, org.mockito.Mockito.times(2))
                                .save(org.mockito.ArgumentMatchers.any(com.testmanagementtool.model.DeviceLog.class));
        }
}
