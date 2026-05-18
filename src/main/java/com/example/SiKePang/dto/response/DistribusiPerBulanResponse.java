package com.example.SiKePang.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DistribusiPerBulanResponse {
    private String bulan;
    private long jumlah;
}
