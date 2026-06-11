package com.penguin.template.service.impl;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.penguin.template.domain.user.UserChangePasswordCommand;
import com.penguin.template.domain.user.UserCreateCommand;
import com.penguin.template.domain.user.UserDTO;
import com.penguin.template.domain.user.UserSignInCommand;
import com.penguin.template.domain.user.UserUpdateProfileCommand;
import com.penguin.template.domain.user.exception.BadCredentialsException;
import com.penguin.template.domain.user.exception.EmailAlreadyExistException;
import com.penguin.template.entity.User;
import com.penguin.template.repository.UserRepository;
import com.penguin.template.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDTO getUserById(UUID userId) {
        return userRepository.get(userId)
            .map(UserDTO::fromEntity)
            .orElse(null);
    }

    @Override
    public UserDTO getUserByName(String username) {
        List<User> userList = userRepository.findAllByUsername(username);
        if (userList.isEmpty()) {
            return null;
        } else {
            return UserDTO.fromEntity(userList.getFirst());
        }
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return null;
    }

    @Override
    public UserDTO create(UserCreateCommand userCreateCommand) {
        Optional<User> existUser = userRepository.findByEmail(userCreateCommand.getEmail());

        boolean emailExists = existUser.isPresent();
        if (emailExists) throw new EmailAlreadyExistException("Email already exist");

        // TODO: hash password with salt
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(userCreateCommand.getEmail());
        user.setUsername(userCreateCommand.getUsername());
        user.setPassword(userCreateCommand.getPassword());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        User newUser = userRepository.create(user);

        return UserDTO.fromEntity(newUser);
    }

    @Override
    public UserDTO updateProfile(UUID userId, UserUpdateProfileCommand cmd) {
        Optional<User> existUser = userRepository.get(userId);
        if (existUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = existUser.get();
        user.setUsername(cmd.getUsername());
        user.setUpdatedAt(Instant.now());
        User updated = userRepository.update(user);
        return UserDTO.fromEntity(updated);
    }

    @Override
    public void changePassword(UUID userId, UserChangePasswordCommand cmd) {
        Optional<User> existUser = userRepository.get(userId);
        if (existUser.isEmpty()) {
            throw new BadCredentialsException("User not found");
        }
        User user = existUser.get();
        String stored = user.getPassword();
        boolean valid = stored.startsWith("$2a$") || stored.startsWith("$2b$")
            ? passwordEncoder.matches(cmd.getOldPassword(), stored)
            : stored.equals(cmd.getOldPassword());
        if (!valid) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(cmd.getNewPassword()));
        user.setUpdatedAt(Instant.now());
        userRepository.update(user);
    }

    @Override
    public void deleteUser(UUID userId) {
        userRepository.delete(userId);
    }

    @Override
    public UserDTO verifyUser(UserSignInCommand command) {
        Optional<User> existUser = userRepository.findByEmail(command.getEmail());
        if (existUser.isEmpty()) {
            throw new BadCredentialsException("Email or password is incorrect");
        }
        User user = existUser.get();
        String stored = user.getPassword();
        boolean valid = stored.startsWith("$2a$") || stored.startsWith("$2b$")
            ? passwordEncoder.matches(command.getPassword(), stored)
            : stored.equals(command.getPassword());
        if (!valid) {
            throw new BadCredentialsException("Email or password is incorrect");
        }
        return UserDTO.fromEntity(user);
    }

    @Override
    public boolean existsById(UUID userId) {
        Optional<User> user = userRepository.get(userId);
        return !user.isEmpty();
    }
}
