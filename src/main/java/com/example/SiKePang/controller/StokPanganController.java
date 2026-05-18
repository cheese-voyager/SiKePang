package com.example.SiKePang.controller;

import com.example.SiKePang.dto.request.StokPanganRequest;
import com.example.SiKePang.dto.response.ApiResponse;
import com.example.SiKePang.dto.response.StokPanganResponse;
import com.example.SiKePang.entity.Komoditas;
import com.example.SiKePang.entity.Petani;
import com.example.SiKePang.entity.StokPangan;
import com.example.SiKePang.service.KomoditasService;
import com.example.SiKePang.service.PetaniService;
import com.example.SiKePang.service.StokPanganService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stok-pangan")
public class StokPanganController {

    private final StokPanganService stokPanganService;
    private final PetaniService petaniService;
    private final KomoditasService komoditasService;

    public StokPanganController(StokPanganService stokPanganService,
                                PetaniService petaniService,
                                KomoditasService komoditasService) {
        this.stokPanganService = stokPanganService;
        this.petaniService = petaniService;
        this.komoditasService = komoditasService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StokPanganResponse>>> getAll() {
        List<StokPanganResponse> data = stokPanganService.getAll().stream()
                .map(StokPanganResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Data stok pangan berhasil diambil", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StokPanganResponse>> getById(@PathVariable Long id) {
        StokPanganResponse data = StokPanganResponse.fromEntity(stokPanganService.getById(id));
        return ResponseEntity.ok(ApiResponse.success("Data stok pangan ditemukan", data));
    }

    @GetMapping("/petani/{petaniId}")
    public ResponseEntity<ApiResponse<List<StokPanganResponse>>> getByPetani(@PathVariable Long petaniId) {
        List<StokPanganResponse> data = stokPanganService.getByPetaniId(petaniId).stream()
                .map(StokPanganResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Data stok pangan petani berhasil diambil", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StokPanganResponse>> create(@Valid @RequestBody StokPanganRequest request) {
        Petani petani = petaniService.getById(request.getPetaniId());
        Komoditas komoditas = komoditasService.getById(request.getKomoditasId());

        StokPangan stokPangan = new StokPangan();
        stokPangan.setPetani(petani);
        stokPangan.setKomoditas(komoditas);
        stokPangan.setJumlah(request.getJumlah());
        stokPangan.setJenisTransaksi(request.getJenisTransaksi());

        StokPanganResponse data = StokPanganResponse.fromEntity(stokPanganService.create(stokPangan));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Stok pangan berhasil ditambahkan", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StokPanganResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody StokPanganRequest request) {
        Petani petani = petaniService.getById(request.getPetaniId());
        Komoditas komoditas = komoditasService.getById(request.getKomoditasId());

        StokPangan stokPangan = new StokPangan();
        stokPangan.setPetani(petani);
        stokPangan.setKomoditas(komoditas);
        stokPangan.setJumlah(request.getJumlah());
        stokPangan.setJenisTransaksi(request.getJenisTransaksi());

        StokPanganResponse data = StokPanganResponse.fromEntity(stokPanganService.update(id, stokPangan));
        return ResponseEntity.ok(ApiResponse.success("Stok pangan berhasil diupdate", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        stokPanganService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Stok pangan berhasil dihapus", null));
    }
}
