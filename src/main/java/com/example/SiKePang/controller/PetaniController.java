package com.example.SiKePang.controller;

import com.example.SiKePang.dto.request.PetaniRequest;
import com.example.SiKePang.dto.response.ApiResponse;
import com.example.SiKePang.dto.response.PetaniResponse;
import com.example.SiKePang.entity.Petani;
import com.example.SiKePang.service.PetaniService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/petani")
public class PetaniController {

    private final PetaniService petaniService;

    public PetaniController(PetaniService petaniService) {
        this.petaniService = petaniService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PetaniResponse>>> getAll() {
        List<PetaniResponse> data = petaniService.getAll().stream()
                .map(PetaniResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Data petani berhasil diambil", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetaniResponse>> getById(@PathVariable Long id) {
        PetaniResponse data = PetaniResponse.fromEntity(petaniService.getById(id));
        return ResponseEntity.ok(ApiResponse.success("Data petani ditemukan", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PetaniResponse>> create(@Valid @RequestBody PetaniRequest request) {
        Petani petani = new Petani();
        petani.setNama(request.getNama());
        petani.setEmail(request.getEmail());
        petani.setPassword(request.getPassword());
        petani.setKelompokTani(request.getKelompokTani());
        petani.setAlamat(request.getAlamat());
        petani.setNomorTelepon(request.getNomorTelepon());

        PetaniResponse data = PetaniResponse.fromEntity(petaniService.create(petani));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Petani berhasil dibuat", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PetaniResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody PetaniRequest request) {
        Petani petani = new Petani();
        petani.setNama(request.getNama());
        petani.setEmail(request.getEmail());
        petani.setPassword(request.getPassword());
        petani.setKelompokTani(request.getKelompokTani());
        petani.setAlamat(request.getAlamat());
        petani.setNomorTelepon(request.getNomorTelepon());

        PetaniResponse data = PetaniResponse.fromEntity(petaniService.update(id, petani));
        return ResponseEntity.ok(ApiResponse.success("Data petani berhasil diupdate", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        petaniService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Petani berhasil dihapus", null));
    }
}
