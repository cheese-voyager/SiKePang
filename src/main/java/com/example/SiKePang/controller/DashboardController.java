package com.example.SiKePang.controller;

import com.example.SiKePang.dto.response.*;
import com.example.SiKePang.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        DashboardStatsResponse stats = dashboardService.getStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats berhasil diambil", stats));
    }

    @GetMapping("/stok-trend")
    public ResponseEntity<ApiResponse<List<StokTrendResponse>>> getStokTrend() {
        List<StokTrendResponse> data = dashboardService.getStokTrend();
        return ResponseEntity.ok(ApiResponse.success("Data tren stok berhasil diambil", data));
    }

    @GetMapping("/distribusi-per-bulan")
    public ResponseEntity<ApiResponse<List<DistribusiPerBulanResponse>>> getDistribusiPerBulan() {
        List<DistribusiPerBulanResponse> data = dashboardService.getDistribusiPerBulan();
        return ResponseEntity.ok(ApiResponse.success("Data distribusi per bulan berhasil diambil", data));
    }
}
