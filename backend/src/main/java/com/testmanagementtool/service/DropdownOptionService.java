package com.testmanagementtool.service;

import com.testmanagementtool.model.DropdownOption;
import com.testmanagementtool.repository.DropdownOptionRepository;
import com.testmanagementtool.model.TestAccount;
import com.testmanagementtool.repository.TestAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DropdownOptionService {

    @Autowired
    private DropdownOptionRepository repository;

    @Autowired
    private TestAccountRepository testAccountRepository;

    public List<DropdownOption> getOptions(String category) {
        return repository.findByCategory(category);
    }

    public DropdownOption addOption(String category, String value) {
        if (repository.existsByCategoryAndValue(category, value)) {
            throw new IllegalArgumentException("Option already exists");
        }
        DropdownOption option = new DropdownOption();
        option.setCategory(category);
        option.setValue(value);
        return repository.save(option);
    }

    public void deleteOption(String id) {
        repository.deleteById(id);
    }

    public DropdownOption updateOption(String id, String newValue) {
        DropdownOption option = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Option not found"));

        String oldValue = option.getValue();
        String category = option.getCategory();

        option.setValue(newValue);
        DropdownOption savedOption = repository.save(option);

        // Propagate changes to TestAccount records
        if ("ENVIRONMENT".equals(category)) {
            List<TestAccount> accounts = testAccountRepository.findByEnvironment(oldValue);
            for (TestAccount account : accounts) {
                account.setEnvironment(newValue);
                testAccountRepository.save(account);
            }
        } else if ("ROLE".equals(category)) {
            List<TestAccount> accounts = testAccountRepository.findByRoleContaining(oldValue);
            for (TestAccount account : accounts) {
                List<String> roles = account.getRole();
                if (roles != null && roles.contains(oldValue)) {
                    roles.set(roles.indexOf(oldValue), newValue);
                    account.setRole(roles);
                    testAccountRepository.save(account);
                }
            }
        }

        return savedOption;
    }
}
