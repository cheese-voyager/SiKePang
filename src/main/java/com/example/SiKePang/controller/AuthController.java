package com.example.SiKePang.controller;

import com.example.SiKePang.dto.request.LoginRequest;
import com.example.SiKePang.dto.request.RegisterRequest;
import com.example.SiKePang.dto.response.ApiResponse;
import com.example.SiKePang.dto.response.LoginResponse;
import com.example.SiKePang.entity.BasePengguna;
import com.example.SiKePang.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, String>>> refresh(@RequestBody Map<String, String> body) {
        // Simplified refresh: since there's no JWT yet, just return a placeholder token.
        // When JWT is implemented, this would validate the refresh token and issue a new access token.
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Refresh token tidak boleh kosong"));
        }
        // In a real implementation, validate the refresh token here
        Map<String, String> tokens = Map.of(
                "accessToken", "refreshed-access-token-" + System.currentTimeMillis(),
                "refreshToken", refreshToken
        );
        return ResponseEntity.ok(ApiResponse.success("Token berhasil di-refresh", tokens));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // In a real implementation with JWT, blacklist the token here
        return ResponseEntity.ok(ApiResponse.success("Logout berhasil", null));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<LoginResponse>> getProfile(@RequestHeader(value = "X-User-Id", required = false) Long userId,
                                                                   @RequestParam(value = "email", required = false) String email) {
        // Try to get user by ID first, then by email
        BasePengguna pengguna = null;
        if (userId != null) {
            pengguna = authService.getById(userId);
        } else if (email != null && !email.isBlank()) {
            pengguna = authService.getByEmail(email);
        }

        if (pengguna == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User tidak ditemukan. Silakan login kembali."));
        }

        LoginResponse response = LoginResponse.fromEntity(pengguna);
        return ResponseEntity.ok(ApiResponse.success("Profil berhasil diambil", response));
    }
}
