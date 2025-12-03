package com.testmanagementtool;

import org.junit.jupiter.api.Test;
import com.testmanagementtool.repository.UserRepository;
import com.testmanagementtool.repository.DeviceRepository;
import com.testmanagementtool.repository.TestAccountRepository;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;

@SpringBootTest(properties = "spring.data.mongodb.uri=mongodb://localhost:27017/test")
@EnableAutoConfiguration(exclude = { MongoAutoConfiguration.class, MongoDataAutoConfiguration.class,
		org.springframework.boot.autoconfigure.data.mongo.MongoRepositoriesAutoConfiguration.class })
class TestTeamDashboardApplicationTests {

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private DeviceRepository deviceRepository;

	@MockBean
	private TestAccountRepository testAccountRepository;

	@MockBean
	private com.testmanagementtool.repository.DropdownOptionRepository dropdownOptionRepository;

	@MockBean
	private com.testmanagementtool.repository.SystemConfigRepository systemConfigRepository;

	@MockBean
	private com.testmanagementtool.repository.DeviceLogRepository deviceLogRepository;

	@Test
	void contextLoads() {
	}
}
