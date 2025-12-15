package com.testmanagementtool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testmanagementtool.model.User;
import com.testmanagementtool.repository.UserRepository;
import com.testmanagementtool.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import static com.testmanagementtool.util.TestConstants.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private BCryptPasswordEncoder passwordEncoder;

    // Mock other repos to avoid context issues
    @MockBean
    private com.testmanagementtool.repository.DeviceRepository deviceRepository;
    @MockBean
    private com.testmanagementtool.repository.DeviceLogRepository deviceLogRepository;
    @MockBean
    private com.testmanagementtool.repository.SystemConfigRepository systemConfigRepository;
    @MockBean
    private com.testmanagementtool.repository.TestAccountRepository testAccountRepository;
    @MockBean
    private com.testmanagementtool.repository.DropdownOptionRepository dropdownOptionRepository;

    @Test
    public void testLoginSuccess() throws Exception {
        String username = TEST_USERNAME;
        String password = TEST_PASSWORD;
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername(username);
        user.setPassword(TEST_ENCODED_PASSWORD);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, TEST_ENCODED_PASSWORD)).thenReturn(true);
        when(jwtUtil.generateToken(username)).thenReturn(TEST_TOKEN);

        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", username);
        loginRequest.put("password", password);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(TEST_TOKEN));
    }

    @Test
    public void testLoginFailure() throws Exception {
        String username = TEST_USERNAME;
        String password = "wrongpassword";
        User user = new User();
        user.setUsername(username);
        user.setPassword(TEST_ENCODED_PASSWORD);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, TEST_ENCODED_PASSWORD)).thenReturn(false);

        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", username);
        loginRequest.put("password", password);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
