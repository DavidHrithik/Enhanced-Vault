package com.testmanagementtool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testmanagementtool.model.SystemConfig;
import com.testmanagementtool.repository.SystemConfigRepository;
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
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@EnableAutoConfiguration(exclude = { MongoAutoConfiguration.class, MongoDataAutoConfiguration.class,
        MongoRepositoriesAutoConfiguration.class })
@SuppressWarnings("null")
public class SystemConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SystemConfigRepository repository;

    @MockBean
    private com.testmanagementtool.repository.UserRepository userRepository;
    @MockBean
    private com.testmanagementtool.repository.DeviceRepository deviceRepository;
    @MockBean
    private com.testmanagementtool.repository.DeviceLogRepository deviceLogRepository;
    @MockBean
    private com.testmanagementtool.repository.TestAccountRepository testAccountRepository;
    @MockBean
    private com.testmanagementtool.repository.DropdownOptionRepository dropdownOptionRepository;

    @Test
    public void testGetAllConfigs() throws Exception {
        SystemConfig config = new SystemConfig();
        config.setKey("APP_NAME");
        config.setValue("My Test App");

        when(repository.findAll()).thenReturn(Arrays.asList(config));

        mockMvc.perform(get("/api/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.APP_NAME").value("My Test App"));
    }

    @Test
    public void testUpdateConfig() throws Exception {
        SystemConfig config = new SystemConfig();
        config.setKey("APP_NAME");
        config.setValue("Updated App");

        when(repository.findByKey("APP_NAME")).thenReturn(null);
        when(repository.save(any(SystemConfig.class))).thenAnswer(i -> i.getArgument(0));

        mockMvc.perform(post("/api/config")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(config)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").value("APP_NAME"))
                .andExpect(jsonPath("$.value").value("Updated App"));
    }
}
