package com.example.SiKePang.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsResponse {

    private long totalPetani;
    private long totalKomoditas;
    private double totalStokMasuk;
    private double totalStokKeluar;
    private long totalDistribusi;
    private long distribusiSelesai;
    private long distribusiProses;
    private long distribusiMenunggu;
}
