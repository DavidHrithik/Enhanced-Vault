package com.testmanagementtool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testmanagementtool.model.DropdownOption;
import com.testmanagementtool.service.DropdownOptionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.data.mongodb.uri=mongodb://localhost:27017/test")
@AutoConfigureMockMvc
@SuppressWarnings("null")
class DropdownOptionControllerTest {

    @MockBean
    private org.springframework.data.mongodb.core.mapping.MongoMappingContext mongoMappingContext;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DropdownOptionService dropdownOptionService;

    @MockBean
    private com.testmanagementtool.repository.UserRepository userRepository;

    @MockBean
    private com.testmanagementtool.repository.DeviceRepository deviceRepository;

    @MockBean
    private com.testmanagementtool.repository.TestAccountRepository testAccountRepository;

    @MockBean
    private com.testmanagementtool.repository.SystemConfigRepository systemConfigRepository;

    @MockBean
    private com.testmanagementtool.repository.DropdownOptionRepository dropdownOptionRepository;

    @MockBean
    private com.testmanagementtool.repository.DeviceLogRepository deviceLogRepository;

    @Test
    void testGetOptions() throws Exception {
        DropdownOption option1 = new DropdownOption();
        option1.setCategory("testType");
        option1.setValue("Manual");

        List<DropdownOption> options = Arrays.asList(option1);

        when(dropdownOptionService.getOptions("testType")).thenReturn(options);

        mockMvc.perform(get("/api/options/testType"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].value").value("Manual"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAddOption() throws Exception {
        DropdownOption option = new DropdownOption();
        option.setCategory("testType");
        option.setValue("Automation");

        when(dropdownOptionService.addOption("testType", "Automation")).thenReturn(option);

        Map<String, String> payload = new HashMap<>();
        payload.put("category", "testType");
        payload.put("value", "Automation");

        mockMvc.perform(post("/api/options")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value("Automation"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteOption() throws Exception {
        String id = UUID.randomUUID().toString();
        doNothing().when(dropdownOptionService).deleteOption(id);

        mockMvc.perform(delete("/api/options/" + id))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUpdateOption() throws Exception {
        String id = UUID.randomUUID().toString();
        DropdownOption option = new DropdownOption();
        option.setId(id);
        option.setValue("Updated Value");

        when(dropdownOptionService.updateOption(id, "Updated Value")).thenReturn(option);

        Map<String, String> payload = new HashMap<>();
        payload.put("value", "Updated Value");

        mockMvc.perform(put("/api/options/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value("Updated Value"));
    }
}
