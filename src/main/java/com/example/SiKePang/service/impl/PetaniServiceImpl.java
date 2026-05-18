package com.example.SiKePang.service.impl;

import com.example.SiKePang.entity.Petani;
import com.example.SiKePang.exception.BadRequestException;
import com.example.SiKePang.exception.ResourceNotFoundException;
import com.example.SiKePang.repository.BasePenggunaRepository;
import com.example.SiKePang.repository.PetaniRepository;
import com.example.SiKePang.service.PetaniService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetaniServiceImpl implements PetaniService {

    private final PetaniRepository petaniRepository;
    private final BasePenggunaRepository penggunaRepository;

    public PetaniServiceImpl(PetaniRepository petaniRepository, BasePenggunaRepository penggunaRepository) {
        this.petaniRepository = petaniRepository;
        this.penggunaRepository = penggunaRepository;
    }

    @Override
    public List<Petani> getAll() {
        return petaniRepository.findAll();
    }

    @Override
    public Petani getById(Long id) {
        return petaniRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Petani tidak ditemukan"));
    }

    @Override
    public Petani create(Petani petani) {
        if (penggunaRepository.existsByEmail(petani.getEmail())) {
            throw new BadRequestException("Email sudah digunakan.");
        }
        return petaniRepository.save(petani);
    }

    @Override
    public Petani update(Long id, Petani request) {
        Petani petani = getById(id);
        
        if (!petani.getEmail().equals(request.getEmail()) && penggunaRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email sudah digunakan.");
        }
        
        petani.setNama(request.getNama());
        petani.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            petani.setPassword(request.getPassword());
        }
        petani.setKelompokTani(request.getKelompokTani());
        petani.setAlamat(request.getAlamat());
        petani.setNomorTelepon(request.getNomorTelepon());
        
        return petaniRepository.save(petani);
    }

    @Override
    public void delete(Long id) {
        Petani petani = getById(id);
        petaniRepository.delete(petani);
    }
}
