package com.dreamstay.service;

import com.dreamstay.dto.RoomRequest;
import com.dreamstay.dto.RoomResponse;
import com.dreamstay.entity.Room;
import com.dreamstay.exception.BadRequestException;
import com.dreamstay.exception.ResourceNotFoundException;
import com.dreamstay.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(RoomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public RoomResponse getRoomById(Long id) {
        Room room = findRoomOrThrow(id);
        return RoomResponse.fromEntity(room);
    }

    public List<RoomResponse> searchAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }
        return roomRepository.findAvailableRooms(checkIn, checkOut).stream()
                .map(RoomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new BadRequestException("Room number already exists: " + request.getRoomNumber());
        }
        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .type(request.getType())
                .pricePerNight(request.getPricePerNight())
                .capacity(request.getCapacity())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .available(request.getAvailable() == null ? true : request.getAvailable())
                .amenities(request.getAmenities())
                .build();
        return RoomResponse.fromEntity(roomRepository.save(room));
    }

    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = findRoomOrThrow(id);
        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setPricePerNight(request.getPricePerNight());
        room.setCapacity(request.getCapacity());
        room.setDescription(request.getDescription());
        room.setImageUrl(request.getImageUrl());
        room.setAmenities(request.getAmenities());
        if (request.getAvailable() != null) {
            room.setAvailable(request.getAvailable());
        }
        return RoomResponse.fromEntity(roomRepository.save(room));
    }

    public void deleteRoom(Long id) {
        Room room = findRoomOrThrow(id);
        roomRepository.delete(room);
    }

    public Room findRoomOrThrow(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }
}
