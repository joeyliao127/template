package com.penguin.template.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.penguin.template.domain.user.UserCreateCommand;
import com.penguin.template.domain.user.UserDTO;
import com.penguin.template.domain.user.UserSignInCommand;
import com.penguin.template.domain.user.UserUpdateProfileCommand;
import com.penguin.template.domain.user.exception.BadCredentialsException;
import com.penguin.template.domain.user.exception.EmailAlreadyExistException;
import com.penguin.template.repository.UserRepository;
import com.penguin.template.service.UserService;

/**
 * 使用者的業務規則：註冊、email 不可重複、登入驗證密碼、修改名稱。
 * 前置（src/test/resources/data.sql）：使用者 ...0001 tester（tester@example.com）、
 * ...0002 reviewer（reviewer@example.com），密碼都是 admin1234 的 BCrypt 雜湊。
 * 被擋下的操作前提是 service「先查再擋」（例如 email 重複先查，不靠唯一約束失敗），
 * 所以例外之後同一個交易還能查資料庫，確認資料沒變。
 */
@SpringBootTest
public class UserServiceImplTest {

    private static final UUID TESTER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    @Test
    @DisplayName("註冊 newcomer：回傳新的 id，之後用 id 查得到名稱與 email")
    public void create() {
        UserCreateCommand command = new UserCreateCommand();
        command.setUsername("newcomer");
        command.setEmail("newcomer@example.com");
        command.setPassword("secret123");

        UserDTO result = userService.create(command);

        assertNotNull(result.getId());
        assertNotNull(result.getCreatedAt());
        // 重新查一次，確認是真的存進資料庫
        UserDTO saved = userService.getUserById(result.getId());
        assertEquals("newcomer", saved.getUsername());
        assertEquals("newcomer@example.com", saved.getEmail());
    }

    @Transactional
    @Test
    @DisplayName("用 tester 的 email 註冊：丟出 EmailAlreadyExistException，使用者仍是 2 位")
    public void create_duplicateEmail() {
        UserCreateCommand command = new UserCreateCommand();
        command.setUsername("copycat");
        command.setEmail("tester@example.com");
        command.setPassword("secret123");

        EmailAlreadyExistException e = assertThrows(EmailAlreadyExistException.class, () -> userService.create(command));

        assertEquals("Email already exist", e.getMessage());
        assertEquals(2, userRepository.count());
    }

    @Test
    @DisplayName("tester 登入：admin1234 登得進去，密碼打錯丟出 BadCredentialsException")
    public void verifyUser_wrongPassword() {
        // 先確認正確密碼登得進去；不然測試資料的雜湊本身錯了，「密碼錯誤被擋」也會通過
        UserSignInCommand correct = new UserSignInCommand();
        correct.setEmail("tester@example.com");
        correct.setPassword("admin1234");
        assertEquals(TESTER_ID, userService.verifyUser(correct).getId());

        UserSignInCommand wrong = new UserSignInCommand();
        wrong.setEmail("tester@example.com");
        wrong.setPassword("admin12345");

        BadCredentialsException e = assertThrows(BadCredentialsException.class, () -> userService.verifyUser(wrong));

        assertEquals("Email or password is incorrect", e.getMessage());
    }

    @Transactional
    @Test
    @DisplayName("tester 改名成 tester-renamed：回傳新名稱，重新查也是新名稱，email 不變")
    public void updateProfile() {
        UserUpdateProfileCommand command = new UserUpdateProfileCommand();
        command.setUsername("tester-renamed");

        UserDTO result = userService.updateProfile(TESTER_ID, command);

        assertEquals("tester-renamed", result.getUsername());
        UserDTO saved = userService.getUserById(TESTER_ID);
        assertEquals("tester-renamed", saved.getUsername());
        assertEquals("tester@example.com", saved.getEmail());
    }
}
