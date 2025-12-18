package com.testmanagementtool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testmanagementtool.model.Device;
import com.testmanagementtool.service.DeviceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
import static org.mockito.ArgumentMatchers.eq;
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
        private DeviceService deviceService;

        // Mock other potential dependencies to avoid context loading issues
        @MockBean
        private com.testmanagementtool.repository.UserRepository userRepository;
        @MockBean
        private com.testmanagementtool.repository.TestAccountRepository testAccountRepository;
        @MockBean
        private com.testmanagementtool.repository.SystemConfigRepository systemConfigRepository;
        @MockBean
        private com.testmanagementtool.repository.DropdownOptionRepository dropdownOptionRepository;
        // Dependencies of DeviceService (not strictly needed if DeviceService is
        // mocked, but good for context safety)
        @MockBean
        private com.testmanagementtool.repository.DeviceRepository deviceRepository;
        @MockBean
        private com.testmanagementtool.repository.DeviceLogRepository deviceLogRepository;

        @Test
        @WithMockUser
        public void testGetAllDevices() throws Exception {
                Device device = new Device();
                device.setId(UUID.randomUUID());
                device.setModel("Pixel 6");
                device.setOwner("John Doe");

                when(deviceService.getAllDevices()).thenReturn(Arrays.asList(device));

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

                when(deviceService.getDeviceById(id)).thenReturn(Optional.of(device));

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

                when(deviceService.createDevice(any(Device.class))).thenAnswer(i -> {
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

                Device updatedInput = new Device();
                updatedInput.setOwner("New Owner");
                updatedInput.setStatus("In Use");

                Device updatedResult = new Device();
                updatedResult.setId(id);
                updatedResult.setOwner("New Owner");
                updatedResult.setStatus("In Use");

                when(deviceService.updateDevice(eq(id), any(Device.class))).thenReturn(Optional.of(updatedResult));

                mockMvc.perform(put("/api/devices/" + id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updatedInput)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.owner").value("New Owner"))
                                .andExpect(jsonPath("$.status").value("In Use"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        public void testDeleteDevice() throws Exception {
                UUID id = UUID.randomUUID();
                doNothing().when(deviceService).deleteDevice(id);

                mockMvc.perform(delete("/api/devices/" + id))
                                .andExpect(status().isOk());
        }
}
