package com.example.SiKePang.service;

import com.example.SiKePang.dto.request.RegisterRequest;
import com.example.SiKePang.entity.BasePengguna;

public interface AuthService {
    BasePengguna login(String email, String password);
    BasePengguna register(RegisterRequest request);
}
