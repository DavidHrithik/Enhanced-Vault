package com.testmanagementtool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testmanagementtool.model.SystemConfig;
import com.testmanagementtool.repository.SystemConfigRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;

@SpringBootTest(properties = "spring.data.mongodb.uri=mongodb://localhost:27017/test")
@AutoConfigureMockMvc
@EnableAutoConfiguration(exclude = { MongoAutoConfiguration.class, MongoDataAutoConfiguration.class,
        org.springframework.boot.autoconfigure.data.mongo.MongoRepositoriesAutoConfiguration.class })
class SystemConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SystemConfigRepository systemConfigRepository;

    @MockBean
    private com.testmanagementtool.repository.UserRepository userRepository;

    @MockBean
    private com.testmanagementtool.repository.DeviceRepository deviceRepository;

    @MockBean
    private com.testmanagementtool.repository.TestAccountRepository testAccountRepository;

    @MockBean
    private com.testmanagementtool.repository.DropdownOptionRepository dropdownOptionRepository;

    @MockBean
    private com.testmanagementtool.repository.DeviceLogRepository deviceLogRepository;

    @Test
    void testGetAllConfigs() throws Exception {
        SystemConfig config1 = new SystemConfig();
        config1.setKey("appName");
        config1.setValue("Test Dashboard");

        SystemConfig config2 = new SystemConfig();
        config2.setKey("theme");
        config2.setValue("dark");

        List<SystemConfig> configs = Arrays.asList(config1, config2);

        when(systemConfigRepository.findAll()).thenReturn(configs);

        mockMvc.perform(get("/api/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.appName").value("Test Dashboard"))
                .andExpect(jsonPath("$.theme").value("dark"));
    }

    @Test
    void testUpdateConfig() throws Exception {
        SystemConfig config = new SystemConfig();
        config.setKey("appName");
        config.setValue("New Dashboard");

        when(systemConfigRepository.save(any(SystemConfig.class))).thenReturn(config);

        mockMvc.perform(post("/api/config")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(config)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").value("appName"))
                .andExpect(jsonPath("$.value").value("New Dashboard"));
    }
}
