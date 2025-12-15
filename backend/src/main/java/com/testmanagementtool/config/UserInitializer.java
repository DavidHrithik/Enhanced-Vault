package com.testmanagementtool.config;

import com.testmanagementtool.model.User;
import com.testmanagementtool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.UUID;

@Configuration
public class UserInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setId(UUID.randomUUID());
            admin.setUsername("admin");
            String adminPwd = System.getenv("ADMIN_PASSWORD") != null ? System.getenv("ADMIN_PASSWORD") : "admin123";
            admin.setPassword(passwordEncoder.encode(adminPwd));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }
        if (userRepository.findByUsername("user").isEmpty()) {
            User user = new User();
            user.setId(UUID.randomUUID());
            user.setUsername("user");
            String userPwd = System.getenv("USER_PASSWORD") != null ? System.getenv("USER_PASSWORD") : "user123";
            user.setPassword(passwordEncoder.encode(userPwd));
            user.setRole("USER");
            userRepository.save(user);
        }
    }
}
