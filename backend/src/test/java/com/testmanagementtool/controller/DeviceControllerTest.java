package com.testmanagementtool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testmanagementtool.model.Device;
import com.testmanagementtool.repository.DeviceLogRepository;
import com.testmanagementtool.repository.DeviceRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
public class DeviceControllerTest {

        @MockBean
        private org.springframework.data.mongodb.core.mapping.MongoMappingContext mongoMappingContext;

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private DeviceRepository deviceRepository;

        @MockBean
        private DeviceLogRepository deviceLogRepository;

        // Mock other potential dependencies to avoid context loading issues
        @MockBean
        private com.testmanagementtool.repository.UserRepository userRepository;
        @MockBean
        private com.testmanagementtool.repository.TestAccountRepository testAccountRepository;
        @MockBean
        private com.testmanagementtool.repository.SystemConfigRepository systemConfigRepository;
        @MockBean
        private com.testmanagementtool.repository.DropdownOptionRepository dropdownOptionRepository;

        @Test
        @WithMockUser
        public void testGetAllDevices() throws Exception {
                Device device = new Device();
                device.setId(UUID.randomUUID());
                device.setModel("Pixel 6");
                device.setOwner("John Doe");

                when(deviceRepository.findAll()).thenReturn(Arrays.asList(device));

                mockMvc.perform(get("/api/devices"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].model").value("Pixel 6"));
        }

        @Test
        @WithMockUser
        public void testGetDeviceById() throws Exception {
                UUID id = UUID.randomUUID();
                Device device = new Device();
                device.setId(id);
                device.setModel("Pixel 6");

                when(deviceRepository.findById(id)).thenReturn(Optional.of(device));

                mockMvc.perform(get("/api/devices/" + id))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.model").value("Pixel 6"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        public void testCreateDevice() throws Exception {
                Device device = new Device();
                device.setModel("iPhone 13");
                device.setOwner("Jan");

                when(deviceRepository.save(any(Device.class))).thenAnswer(i -> {
                        Device d = i.getArgument(0);
                        d.setId(UUID.randomUUID());
                        return d;
                });

                mockMvc.perform(post("/api/devices")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(device)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.model").value("iPhone 13"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        public void testUpdateDevice() throws Exception {
                UUID id = UUID.randomUUID();
                Device existing = new Device();
                existing.setId(id);
                existing.setModel("Pixel 6");
                existing.setOwner("Old Owner");
                existing.setStatus("Available");

                Device updated = new Device();
                updated.setOwner("New Owner");
                updated.setStatus("In Use");

                when(deviceRepository.findById(id)).thenReturn(Optional.of(existing));
                when(deviceRepository.save(any(Device.class))).thenAnswer(i -> i.getArgument(0));

                mockMvc.perform(put("/api/devices/" + id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updated)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.owner").value("New Owner"))
                                .andExpect(jsonPath("$.status").value("In Use"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        public void testDeleteDevice() throws Exception {
                UUID id = UUID.randomUUID();
                doNothing().when(deviceRepository).deleteById(id);

                mockMvc.perform(delete("/api/devices/" + id))
                                .andExpect(status().isOk());
        }
}
