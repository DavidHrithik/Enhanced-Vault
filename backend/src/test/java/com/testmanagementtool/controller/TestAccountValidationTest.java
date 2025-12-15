package com.testmanagementtool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testmanagementtool.model.TestAccount;
import com.testmanagementtool.service.TestAccountService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;

@WebMvcTest(TestAccountController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters to simplify test, or keep them and mock everything
// Actually, let's keep filters but mock the dependencies.
// If I use addFilters = false, I don't need JwtAuthFilter mock necessarily, but
// SecurityConfig might still load.
// Safest is to Import SecurityConfig or just Mock the beans.
@Import(com.testmanagementtool.config.SecurityConfig.class)
@SuppressWarnings("null")
public class TestAccountValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TestAccountService testAccountService;

    @MockBean
    private com.testmanagementtool.repository.UserRepository userRepository;

    @MockBean
    private com.testmanagementtool.security.JwtAuthFilter jwtAuthFilter;

    @MockBean
    private org.springframework.data.mongodb.core.mapping.MongoMappingContext mongoMappingContext;

    @Test
    @WithMockUser
    public void createAccount_InvalidInput_Returns400() throws Exception {
        TestAccount account = new TestAccount();
        // Missing username and environment

        mockMvc.perform(post("/api/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(account)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.username").value("Username is required"))
                .andExpect(jsonPath("$.environment").value("Environment is required"));
    }

    @Test
    @WithMockUser
    public void createAccount_ValidInput_Returns200() throws Exception {
        TestAccount account = new TestAccount();
        account.setUsername("validUser");
        account.setEnvironment("DEV");

        when(testAccountService.create(any(TestAccount.class))).thenReturn(account);

        mockMvc.perform(post("/api/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(account)))
                .andExpect(status().isOk());
    }
}
