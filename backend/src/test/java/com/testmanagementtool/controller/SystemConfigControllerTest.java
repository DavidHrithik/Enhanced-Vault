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

import static com.testmanagementtool.util.TestConstants.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
public class SystemConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SystemConfigRepository repository;

    @MockBean
    private org.springframework.data.mongodb.core.mapping.MongoMappingContext mongoMappingContext;

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
        config.setKey(TEST_APP_NAME_KEY);
        config.setValue(TEST_APP_NAME_VALUE);

        when(repository.findAll()).thenReturn(Arrays.asList(config));

        mockMvc.perform(get("/api/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$." + TEST_APP_NAME_KEY).value(TEST_APP_NAME_VALUE));
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(username = "admin")
    public void testUpdateConfig() throws Exception {
        SystemConfig config = new SystemConfig();
        config.setKey(TEST_APP_NAME_KEY);
        config.setValue("Updated App");

        when(repository.findByKey(TEST_APP_NAME_KEY)).thenReturn(null);
        when(repository.save(any(SystemConfig.class))).thenAnswer(i -> i.getArgument(0));

        mockMvc.perform(post("/api/config")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(config)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").value(TEST_APP_NAME_KEY))
                .andExpect(jsonPath("$.value").value("Updated App"));
    }
}
