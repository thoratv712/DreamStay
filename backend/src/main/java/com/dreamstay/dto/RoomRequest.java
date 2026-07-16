package com.dreamstay.dto;

import com.dreamstay.entity.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class RoomRequest {

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotNull(message = "Room type is required")
    private RoomType type;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal pricePerNight;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    private String description;

    private String imageUrl;

    private Boolean available;

    private List<String> amenities;
}
