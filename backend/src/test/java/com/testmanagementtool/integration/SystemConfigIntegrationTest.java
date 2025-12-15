package com.testmanagementtool.integration;

import com.testmanagementtool.model.SystemConfig;
import com.testmanagementtool.repository.SystemConfigRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SystemConfigIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SystemConfigRepository repository;

    @BeforeEach
    public void setup() {
        repository.deleteAll();
    }

    @Test
    @SuppressWarnings("null")
    @org.springframework.security.test.context.support.WithMockUser(username = "admin")
    public void testCreateAndGetConfig() throws Exception {
        String key = "INTEGRATION_TEST_KEY";
        String value = "Integration Value";

        SystemConfig config = new SystemConfig();
        config.setKey(key);
        config.setValue(value);

        // Create via API
        mockMvc.perform(post("/api/config")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"key\":\"" + key + "\",\"value\":\"" + value + "\"}"))
                .andExpect(status().isOk());

        // Verify via API
        mockMvc.perform(get("/api/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$." + key).value(value));
    }
}
