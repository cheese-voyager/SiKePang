package com.example.SiKePang.service.impl;

import com.example.SiKePang.dto.request.RegisterRequest;
import com.example.SiKePang.entity.Admin;
import com.example.SiKePang.entity.BasePengguna;
import com.example.SiKePang.entity.Petani;
import com.example.SiKePang.entity.Petugas;
import com.example.SiKePang.exception.BadRequestException;
import com.example.SiKePang.exception.ResourceNotFoundException;
import com.example.SiKePang.repository.BasePenggunaRepository;
import com.example.SiKePang.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final BasePenggunaRepository penggunaRepository;

    public AuthServiceImpl(BasePenggunaRepository penggunaRepository) {
        this.penggunaRepository = penggunaRepository;
    }

    @Override
    public BasePengguna login(String email, String password) {
        BasePengguna pengguna = penggunaRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User dengan email tersebut tidak ditemukan."));

        if (!pengguna.getPassword().equals(password)) {
            throw new BadRequestException("Password salah.");
        }

        return pengguna;
    }

    @Override
    public BasePengguna register(RegisterRequest request) {
        if (penggunaRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email sudah digunakan.");
        }

        BasePengguna pengguna;
        String secretKey = request.getSecretKey();

        if ("burgerbang0r".equals(secretKey)) {
            Admin admin = new Admin();
            admin.setNama(request.getNama());
            admin.setEmail(request.getEmail());
            admin.setPassword(request.getPassword());
            pengguna = admin;
        } else if ("burgerempukJuicyLuicy".equals(secretKey)) {
            Petugas petugas = new Petugas();
            petugas.setNama(request.getNama());
            petugas.setEmail(request.getEmail());
            petugas.setPassword(request.getPassword());
            pengguna = petugas;
        } else {
            Petani petani = new Petani();
            petani.setNama(request.getNama());
            petani.setEmail(request.getEmail());
            petani.setPassword(request.getPassword());
            petani.setNomorTelepon(request.getPhone());
            petani.setKelompokTani(request.getKelompokTani() != null ? request.getKelompokTani() : "-");
            petani.setAlamat(request.getAlamat() != null ? request.getAlamat() : "-");
            pengguna = petani;
        }

        return penggunaRepository.save(pengguna);
    }
}
