package com.example.SiKePang.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StokTrendResponse {
    private String bulan;
    private double masuk;
    private double keluar;
}
