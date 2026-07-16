package com.dreamstay.controller;

import com.dreamstay.dto.BookingRequest;
import com.dreamstay.dto.BookingResponse;
import com.dreamstay.entity.BookingStatus;
import com.dreamstay.security.CustomUserDetails;
import com.dreamstay.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                           @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(userDetails.getUsername(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getMyBookings(userDetails.getUsername()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                           @PathVariable Long id) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(bookingService.cancelBooking(userDetails.getUsername(), id, isAdmin));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable Long id, @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }
}
