package com.example.SiKePang.controller;

import com.example.SiKePang.dto.response.ApiResponse;
import com.example.SiKePang.dto.response.HargaPasarResponse;
import com.example.SiKePang.entity.HargaPasar;
import com.example.SiKePang.entity.Komoditas;
import com.example.SiKePang.exception.ResourceNotFoundException;
import com.example.SiKePang.repository.HargaPasarRepository;
import com.example.SiKePang.repository.KomoditasRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/harga-pasar")
public class HargaPasarController {

    private final HargaPasarRepository hargaPasarRepository;
    private final KomoditasRepository komoditasRepository;

    public HargaPasarController(HargaPasarRepository hargaPasarRepository,
                                KomoditasRepository komoditasRepository) {
        this.hargaPasarRepository = hargaPasarRepository;
        this.komoditasRepository = komoditasRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HargaPasarResponse>>> getAll() {
        List<HargaPasarResponse> data = hargaPasarRepository.findLatestPrices().stream()
                .map(HargaPasarResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Data harga pasar berhasil diambil", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HargaPasarResponse>> create(@RequestBody HargaPasarRequest request) {
        Komoditas komoditas = komoditasRepository.findById(request.getKomoditasId())
                .orElseThrow(() -> new ResourceNotFoundException("Komoditas tidak ditemukan"));

        HargaPasar hp = new HargaPasar();
        hp.setKomoditas(komoditas);
        hp.setHarga(request.getHarga());
        hp.setSatuanHarga(request.getSatuanHarga() != null ? request.getSatuanHarga() : "/Kg");
        hp.setPerubahan(request.getPerubahan() != null ? request.getPerubahan() : 0.0);

        HargaPasarResponse data = HargaPasarResponse.fromEntity(hargaPasarRepository.save(hp));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Harga pasar berhasil ditambahkan", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HargaPasarResponse>> update(@PathVariable Long id,
                                                                   @RequestBody HargaPasarRequest request) {
        HargaPasar hp = hargaPasarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Harga pasar tidak ditemukan"));

        if (request.getKomoditasId() != null) {
            Komoditas komoditas = komoditasRepository.findById(request.getKomoditasId())
                    .orElseThrow(() -> new ResourceNotFoundException("Komoditas tidak ditemukan"));
            hp.setKomoditas(komoditas);
        }
        if (request.getHarga() != null) hp.setHarga(request.getHarga());
        if (request.getSatuanHarga() != null) hp.setSatuanHarga(request.getSatuanHarga());
        if (request.getPerubahan() != null) hp.setPerubahan(request.getPerubahan());

        HargaPasarResponse data = HargaPasarResponse.fromEntity(hargaPasarRepository.save(hp));
        return ResponseEntity.ok(ApiResponse.success("Harga pasar berhasil diupdate", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        HargaPasar hp = hargaPasarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Harga pasar tidak ditemukan"));
        hargaPasarRepository.delete(hp);
        return ResponseEntity.ok(ApiResponse.success("Harga pasar berhasil dihapus", null));
    }

    // Inner DTO for request
    @lombok.Data
    static class HargaPasarRequest {
        private Long komoditasId;
        private Double harga;
        private String satuanHarga;
        private Double perubahan;
    }
}
