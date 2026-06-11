package com.example.SiKePang.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatbotRequest {

    @NotBlank(message = "Pesan tidak boleh kosong")
    private String message;
}
