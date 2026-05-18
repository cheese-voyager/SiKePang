package com.example.SiKePang.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class StokPanganRequest {

    @NotNull(message = "ID Petani tidak boleh kosong")
    private Long petaniId;

    @NotNull(message = "ID Komoditas tidak boleh kosong")
    private Long komoditasId;

    @NotNull(message = "Jumlah tidak boleh kosong")
    @Positive(message = "Jumlah harus lebih dari 0")
    private Double jumlah;

    @NotNull(message = "Jenis transaksi tidak boleh kosong")
    private String jenisTransaksi; // MASUK atau KELUAR
}
