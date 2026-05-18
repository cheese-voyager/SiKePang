package com.example.SiKePang.controller;

import com.example.SiKePang.dto.request.PenggunaRequest;
import com.example.SiKePang.dto.response.ApiResponse;
import com.example.SiKePang.dto.response.PenggunaResponse;
import com.example.SiKePang.service.PenggunaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pengguna")
public class PenggunaController {

    private final PenggunaService penggunaService;

    public PenggunaController(PenggunaService penggunaService) {
        this.penggunaService = penggunaService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PenggunaResponse>>> getAll() {
        List<PenggunaResponse> data = penggunaService.getAll().stream()
                .map(PenggunaResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Data pengguna berhasil diambil", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PenggunaResponse>> getById(@PathVariable Long id) {
        PenggunaResponse data = PenggunaResponse.fromEntity(penggunaService.getById(id));
        return ResponseEntity.ok(ApiResponse.success("Data pengguna ditemukan", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PenggunaResponse>> create(@Valid @RequestBody PenggunaRequest request) {
        PenggunaResponse data = PenggunaResponse.fromEntity(penggunaService.create(request));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pengguna berhasil dibuat", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PenggunaResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody PenggunaRequest request) {
        PenggunaResponse data = PenggunaResponse.fromEntity(penggunaService.update(id, request));
        return ResponseEntity.ok(ApiResponse.success("Data pengguna berhasil diupdate", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        penggunaService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Pengguna berhasil dihapus", null));
    }
}
