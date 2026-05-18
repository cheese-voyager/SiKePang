package com.example.SiKePang.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class DistribusiRequest {

    @NotNull(message = "ID Petani tidak boleh kosong")
    private Long petaniId;

    @NotBlank(message = "Tujuan distribusi tidak boleh kosong")
    private String tujuan;

    @NotEmpty(message = "Detail komoditas tidak boleh kosong")
    @Valid
    private List<DetailKomoditasRequest> detailDistribusi;

    @Data
    public static class DetailKomoditasRequest {

        @NotNull(message = "ID Komoditas tidak boleh kosong")
        private Long komoditasId;

        @NotNull(message = "Jumlah tidak boleh kosong")
        private Double jumlah;
    }
}
