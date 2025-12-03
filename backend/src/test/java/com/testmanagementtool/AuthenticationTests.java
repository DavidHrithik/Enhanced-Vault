package com.testmanagementtool;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testmanagementtool.model.User;
import com.testmanagementtool.repository.UserRepository;
import com.testmanagementtool.repository.DeviceRepository;
import com.testmanagementtool.repository.TestAccountRepository;
import com.testmanagementtool.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
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
class AuthenticationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private DeviceRepository deviceRepository;

    @MockBean
    private TestAccountRepository testAccountRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private com.testmanagementtool.repository.DropdownOptionRepository dropdownOptionRepository;

    @MockBean
    private com.testmanagementtool.repository.SystemConfigRepository systemConfigRepository;

    @MockBean
    private com.testmanagementtool.repository.DeviceLogRepository deviceLogRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Test
    void testAdminLoginSuccess() throws Exception {
        // Mock Admin User
        User admin = new User();
        admin.setId(UUID.randomUUID());
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(admin));
        when(jwtUtil.generateToken("admin")).thenReturn("mock-jwt-token-admin");

        // Perform Login Request
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("admin", "admin123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token-admin"));
    }

    @Test
    void testUserLoginSuccess() throws Exception {
        // Mock Standard User
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("user");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setRole("USER");

        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken("user")).thenReturn("mock-jwt-token-user");

        // Perform Login Request
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("user", "user123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token-user"));
    }

    @Test
    void testInvalidLogin() throws Exception {
        // Mock User exists but wrong password
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("user");
        user.setPassword(passwordEncoder.encode("user123"));

        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));

        // Perform Login Request with Wrong Password
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("user", "wrongpassword"))))
                .andExpect(status().is4xxClientError()); // Expect 401 Unauthorized
    }

    // Helper class for request body
    static class LoginRequest {
        public String username;
        public String password;

        public LoginRequest(String username, String password) {
            this.username = username;
            this.password = password;
        }
    }
}
