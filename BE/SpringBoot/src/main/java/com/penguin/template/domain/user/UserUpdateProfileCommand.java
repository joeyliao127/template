package com.penguin.template.domain.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UserUpdateProfileCommand {
    @NotEmpty
    private String username;
}
