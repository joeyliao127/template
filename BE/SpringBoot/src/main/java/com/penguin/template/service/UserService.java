package com.penguin.template.service;

import java.util.UUID;

import com.penguin.template.common.command.PageCommand;
import com.penguin.template.common.dto.PageResponse;
import com.penguin.template.domain.user.UserChangePasswordCommand;
import com.penguin.template.domain.user.UserCreateCommand;
import com.penguin.template.domain.user.UserDTO;
import com.penguin.template.domain.user.UserSignInCommand;
import com.penguin.template.domain.user.UserUpdateProfileCommand;

public interface UserService {
    PageResponse<UserDTO> index(PageCommand page);
    UserDTO getUserById(UUID userId);
    UserDTO getUserByName(String username);
    UserDTO getUserByEmail(String email);
    UserDTO create(UserCreateCommand userCreateCommand);
    UserDTO updateProfile(UUID userId, UserUpdateProfileCommand cmd);
    void changePassword(UUID userId, UserChangePasswordCommand cmd);
    void deleteUser(UUID userId);
    UserDTO verifyUser(UserSignInCommand userSignInCommand);
    boolean existsById(UUID userId);
}
