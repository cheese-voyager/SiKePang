package com.example.SiKePang.service;

import com.example.SiKePang.dto.response.DashboardStatsResponse;
import com.example.SiKePang.dto.response.DistribusiPerBulanResponse;
import com.example.SiKePang.dto.response.StokTrendResponse;

import java.util.List;

public interface DashboardService {
    DashboardStatsResponse getStats();
    List<StokTrendResponse> getStokTrend();
    List<DistribusiPerBulanResponse> getDistribusiPerBulan();
}
