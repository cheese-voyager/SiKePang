package com.example.SiKePang.dto.response;

import com.example.SiKePang.entity.BasePengguna;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LoginResponse {

    private Long id;
    private String nama;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    public static LoginResponse fromEntity(BasePengguna pengguna) {
        LoginResponse response = new LoginResponse();
        response.setId(pengguna.getId());
        response.setNama(pengguna.getNama());
        response.setEmail(pengguna.getEmail());
        response.setRole(pengguna.getRole());
        response.setCreatedAt(pengguna.getCreatedAt());
        return response;
    }
}
