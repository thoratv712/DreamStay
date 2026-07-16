package com.dreamstay.service;

import com.dreamstay.dto.AuthResponse;
import com.dreamstay.dto.LoginRequest;
import com.dreamstay.dto.RegisterRequest;
import com.dreamstay.entity.Role;
import com.dreamstay.entity.User;
import com.dreamstay.exception.BadRequestException;
import com.dreamstay.repository.UserRepository;
import com.dreamstay.security.CustomUserDetails;
import com.dreamstay.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.ROLE_USER)
                .build();

        User saved = userRepository.save(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                new CustomUserDetails(saved), null, new CustomUserDetails(saved).getAuthorities());
        String token = jwtUtil.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .id(userDetails.getId())
                .fullName(userDetails.getUser().getFullName())
                .email(userDetails.getUsername())
                .role(userDetails.getUser().getRole().name())
                .build();
    }
}
