package com.penguin.template.repository.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.transaction.annotation.Transactional;

import com.penguin.template.entity.User;
import com.penguin.template.repository.UserRepository;

/**
 * 使用者的 SQL：查詢條件、欄位對應、資料庫約束。
 * 前置（src/test/resources/data.sql）：使用者 ...0001 tester（tester@example.com）、
 * ...0002 reviewer（reviewer@example.com），密碼都是 admin1234 的 BCrypt 雜湊。
 */
@SpringBootTest
public class UserRepositoryImplTest {

    private static final UUID REVIEWER_ID = UUID.fromString("00000000-0000-0000-0000-000000000002");

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("依 email 查 reviewer：查到第二位使用者，欄位都對；查不存在的 email 回傳空的")
    public void findByEmail() {
        Optional<User> found = userRepository.findByEmail("reviewer@example.com");

        assertTrue(found.isPresent());
        User user = found.get();
        assertEquals(REVIEWER_ID, user.getId());
        assertEquals("reviewer", user.getUsername());
        assertEquals("reviewer@example.com", user.getEmail());
        assertNotNull(user.getCreatedAt());
        assertTrue(userRepository.findByEmail("nobody@example.com").isEmpty());
    }

    @Transactional
    @Test
    @DisplayName("新增 newcomer：用 id 查得到，使用者總數變成 3")
    public void create() {
        User user = new User("newcomer@example.com", "newcomer", "plain-password");
        user.setId(UUID.randomUUID());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        User created = userRepository.create(user);

        assertEquals(user.getId(), created.getId());
        // 重新查一次，確認是真的存進資料庫
        User saved = userRepository.get(user.getId()).orElseThrow();
        assertEquals("newcomer", saved.getUsername());
        assertEquals("newcomer@example.com", saved.getEmail());
        assertEquals(3, userRepository.count());
    }

    @Transactional
    @Test
    @DisplayName("邊界：用 tester 的 email 新增，被資料庫的唯一約束擋下")
    public void create_duplicateEmail() {
        User user = new User("tester@example.com", "copycat", "plain-password");
        user.setId(UUID.randomUUID());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        // 這句 SQL 失敗後同一個交易不能再查資料庫，所以例外之後不再做任何查詢
        assertThrows(DuplicateKeyException.class, () -> userRepository.create(user));
    }
}
