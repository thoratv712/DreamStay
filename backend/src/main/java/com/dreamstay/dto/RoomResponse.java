package com.dreamstay.dto;

import com.dreamstay.entity.Room;
import com.dreamstay.entity.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private RoomType type;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private String description;
    private String imageUrl;
    private Boolean available;
    private List<String> amenities;

    public static RoomResponse fromEntity(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .type(room.getType())
                .pricePerNight(room.getPricePerNight())
                .capacity(room.getCapacity())
                .description(room.getDescription())
                .imageUrl(room.getImageUrl())
                .available(room.getAvailable())
                .amenities(room.getAmenities())
                .build();
    }
}
