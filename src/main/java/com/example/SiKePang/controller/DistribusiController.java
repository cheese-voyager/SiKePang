package com.example.SiKePang.controller;

import com.example.SiKePang.dto.request.DistribusiRequest;
import com.example.SiKePang.dto.request.UpdateStatusRequest;
import com.example.SiKePang.dto.response.ApiResponse;
import com.example.SiKePang.dto.response.DistribusiResponse;
import com.example.SiKePang.entity.Distribusi;
import com.example.SiKePang.entity.DistribusiKomoditas;
import com.example.SiKePang.entity.Komoditas;
import com.example.SiKePang.entity.Petani;
import com.example.SiKePang.service.DistribusiService;
import com.example.SiKePang.service.KomoditasService;
import com.example.SiKePang.service.PetaniService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/distribusi")
public class DistribusiController {

    private final DistribusiService distribusiService;
    private final PetaniService petaniService;
    private final KomoditasService komoditasService;

    public DistribusiController(DistribusiService distribusiService,
                                PetaniService petaniService,
                                KomoditasService komoditasService) {
        this.distribusiService = distribusiService;
        this.petaniService = petaniService;
        this.komoditasService = komoditasService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DistribusiResponse>>> getAll() {
        List<DistribusiResponse> data = distribusiService.getAll().stream()
                .map(DistribusiResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Data distribusi berhasil diambil", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DistribusiResponse>> getById(@PathVariable Long id) {
        DistribusiResponse data = DistribusiResponse.fromEntity(distribusiService.getById(id));
        return ResponseEntity.ok(ApiResponse.success("Data distribusi ditemukan", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DistribusiResponse>> create(@Valid @RequestBody DistribusiRequest request) {
        Petani petani = petaniService.getById(request.getPetaniId());

        Distribusi distribusi = new Distribusi();
        distribusi.setPetani(petani);
        distribusi.setTujuan(request.getTujuan());

        List<DistribusiKomoditas> detailList = new ArrayList<>();
        for (DistribusiRequest.DetailKomoditasRequest detailReq : request.getDetailDistribusi()) {
            Komoditas komoditas = komoditasService.getById(detailReq.getKomoditasId());
            DistribusiKomoditas detail = new DistribusiKomoditas();
            detail.setKomoditas(komoditas);
            detail.setJumlah(detailReq.getJumlah());
            detailList.add(detail);
        }
        distribusi.setDetailDistribusi(detailList);

        DistribusiResponse data = DistribusiResponse.fromEntity(distribusiService.create(distribusi));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Distribusi berhasil dibuat", data));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DistribusiResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        DistribusiResponse data = DistribusiResponse.fromEntity(
                distribusiService.updateStatus(id, request.getStatus()));
        return ResponseEntity.ok(ApiResponse.success("Status distribusi berhasil diupdate", data));
    }
}
