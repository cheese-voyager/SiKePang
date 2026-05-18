package com.example.SiKePang.controller;

import com.example.SiKePang.dto.request.LoginRequest;
import com.example.SiKePang.dto.request.RegisterRequest;
import com.example.SiKePang.dto.response.ApiResponse;
import com.example.SiKePang.dto.response.LoginResponse;
import com.example.SiKePang.entity.BasePengguna;
import com.example.SiKePang.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        BasePengguna pengguna = authService.login(request.getEmail(), request.getPassword());
        LoginResponse loginResponse = LoginResponse.fromEntity(pengguna);
        return ResponseEntity.ok(ApiResponse.success("Login berhasil", loginResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<BasePengguna>> register(@Valid @RequestBody RegisterRequest request) {
        BasePengguna pengguna = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registrasi berhasil", pengguna));
    }
}
