package com.example.SiKePang.controller;

import com.example.SiKePang.dto.request.KomoditasRequest;
import com.example.SiKePang.dto.response.ApiResponse;
import com.example.SiKePang.dto.response.KomoditasResponse;
import com.example.SiKePang.entity.Komoditas;
import com.example.SiKePang.service.KomoditasService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/komoditas")
public class KomoditasController {

    private final KomoditasService komoditasService;

    public KomoditasController(KomoditasService komoditasService) {
        this.komoditasService = komoditasService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<KomoditasResponse>>> getAll() {
        List<KomoditasResponse> data = komoditasService.getAll().stream()
                .map(KomoditasResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Data komoditas berhasil diambil", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KomoditasResponse>> getById(@PathVariable Long id) {
        KomoditasResponse data = KomoditasResponse.fromEntity(komoditasService.getById(id));
        return ResponseEntity.ok(ApiResponse.success("Data komoditas ditemukan", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<KomoditasResponse>> create(@Valid @RequestBody KomoditasRequest request) {
        Komoditas komoditas = new Komoditas();
        komoditas.setNama(request.getNama());
        komoditas.setKategori(request.getKategori());
        komoditas.setSatuan(request.getSatuan());

        KomoditasResponse data = KomoditasResponse.fromEntity(komoditasService.create(komoditas));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Komoditas berhasil dibuat", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KomoditasResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody KomoditasRequest request) {
        Komoditas komoditas = new Komoditas();
        komoditas.setNama(request.getNama());
        komoditas.setKategori(request.getKategori());
        komoditas.setSatuan(request.getSatuan());

        KomoditasResponse data = KomoditasResponse.fromEntity(komoditasService.update(id, komoditas));
        return ResponseEntity.ok(ApiResponse.success("Data komoditas berhasil diupdate", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        komoditasService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Komoditas berhasil dihapus", null));
    }
}
