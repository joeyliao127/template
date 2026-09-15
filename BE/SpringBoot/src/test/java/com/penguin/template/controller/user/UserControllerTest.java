package com.penguin.template.controller.user;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.penguin.template.domain.auth.JWTProvider;
import com.penguin.template.domain.user.UserCreateCommand;
import com.penguin.template.domain.user.UserUpdateProfileCommand;

/**
 * 使用者 API 的 HTTP 狀態碼與回應格式。
 * 前置（src/test/resources/data.sql）：使用者 ...0001 tester（tester@example.com）、
 * ...0002 reviewer（reviewer@example.com）。
 * 網址有 /api 前綴：WebConfig 替所有 @RestController 統一加上。
 * signUp、signIn 不需要 token；其餘 API 要帶 Authorization，JWT 過濾器會確認 token 裡的使用者存在資料庫。
 */
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    private static final UUID TESTER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JWTProvider jwtProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    @Test
    @DisplayName("註冊 newcomer：201，回傳 id 與 email，不回傳密碼")
    public void signUp() throws Exception {
        UserCreateCommand command = new UserCreateCommand();
        command.setUsername("newcomer");
        command.setEmail("newcomer@example.com");
        command.setPassword("secret123");
        String json = objectMapper.writeValueAsString(command);

        RequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/api/users/signUp")
                .header("Content-Type", "application/json")
                .content(json);

        mockMvc.perform(requestBuilder)
                .andDo(print())
                .andExpect(status().is(201))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value("newcomer"))
                .andExpect(jsonPath("$.email").value("newcomer@example.com"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Transactional
    @Test
    @DisplayName("註冊時 email 空白：400，result 為 false，message 有驗證訊息")
    public void signUp_blankEmail() throws Exception {
        UserCreateCommand command = new UserCreateCommand();
        command.setUsername("newcomer");
        command.setEmail("");
        command.setPassword("secret123");
        String json = objectMapper.writeValueAsString(command);

        RequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/api/users/signUp")
                .header("Content-Type", "application/json")
                .content(json);

        // message 是 Bean Validation 的預設訊息，文字會隨 JVM 語系不同，所以只驗不是空的
        mockMvc.perform(requestBuilder)
                .andDo(print())
                .andExpect(status().is(400))
                .andExpect(jsonPath("$.result").value(false))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Transactional
    @Test
    @DisplayName("tester 帶 token 改名成 tester-renamed：200，回傳新名稱")
    public void updateProfile() throws Exception {
        UserUpdateProfileCommand command = new UserUpdateProfileCommand();
        command.setUsername("tester-renamed");
        String json = objectMapper.writeValueAsString(command);

        RequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/users/" + TESTER_ID + "/profile")
                .header("Authorization", token())
                .header("Content-Type", "application/json")
                .content(json);

        mockMvc.perform(requestBuilder)
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(jsonPath("$.id").value(TESTER_ID.toString()))
                .andExpect(jsonPath("$.username").value("tester-renamed"));
    }

    /** 產生 tester 的登入 token；JWT 過濾器會檢查這個人存在資料庫（data.sql 有建）。 */
    private String token() {
        return "Bearer " + jwtProvider.generateToken(TESTER_ID, "tester@example.com", "tester");
    }
}
