package com.example.SiKePang.controller;

import com.example.SiKePang.dto.request.ChatbotRequest;
import com.example.SiKePang.dto.response.ApiResponse;
import com.example.SiKePang.service.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<String>> chat(@Valid @RequestBody ChatbotRequest request) {
        String response = chatbotService.generateResponse(request.getMessage());
        return ResponseEntity.ok(ApiResponse.success("Respons chatbot berhasil didapatkan", response));
    }
}
