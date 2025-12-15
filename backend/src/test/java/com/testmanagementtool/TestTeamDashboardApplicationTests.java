package com.testmanagementtool;

import org.junit.jupiter.api.Test;
import com.testmanagementtool.repository.UserRepository;
import com.testmanagementtool.repository.DeviceRepository;
import com.testmanagementtool.repository.TestAccountRepository;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

@SpringBootTest(properties = "spring.data.mongodb.uri=mongodb://localhost:27017/test")
class TestTeamDashboardApplicationTests {

	@MockBean
	private MongoMappingContext mongoMappingContext;

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
