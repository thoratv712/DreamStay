package com.dreamstay.dto;

import com.dreamstay.entity.Booking;
import com.dreamstay.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private String roomImageUrl;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer guests;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private LocalDateTime createdAt;

    public static BookingResponse fromEntity(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userFullName(booking.getUser().getFullName())
                .roomId(booking.getRoom().getId())
                .roomNumber(booking.getRoom().getRoomNumber())
                .roomType(booking.getRoom().getType().name())
                .roomImageUrl(booking.getRoom().getImageUrl())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .guests(booking.getGuests())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
