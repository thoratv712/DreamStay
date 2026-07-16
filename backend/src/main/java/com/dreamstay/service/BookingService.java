package com.dreamstay.service;

import com.dreamstay.dto.BookingRequest;
import com.dreamstay.dto.BookingResponse;
import com.dreamstay.entity.Booking;
import com.dreamstay.entity.BookingStatus;
import com.dreamstay.entity.Room;
import com.dreamstay.entity.User;
import com.dreamstay.exception.BadRequestException;
import com.dreamstay.exception.ResourceNotFoundException;
import com.dreamstay.repository.BookingRepository;
import com.dreamstay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;

    public BookingResponse createBooking(String userEmail, BookingRequest request) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomService.findRoomOrThrow(request.getRoomId());

        if (Boolean.FALSE.equals(room.getAvailable())) {
            throw new BadRequestException("This room is currently not available for booking");
        }

        if (request.getGuests() > room.getCapacity()) {
            throw new BadRequestException("Number of guests exceeds room capacity of " + room.getCapacity());
        }

        boolean overlapping = bookingRepository.existsOverlappingBooking(
                room.getId(), request.getCheckInDate(), request.getCheckOutDate());
        if (overlapping) {
            throw new BadRequestException("Room is already booked for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .guests(request.getGuests())
                .totalPrice(totalPrice)
                .status(BookingStatus.CONFIRMED)
                .build();

        return BookingResponse.fromEntity(bookingRepository.save(booking));
    }

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(String userEmail, Long bookingId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!isAdmin && !booking.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return BookingResponse.fromEntity(bookingRepository.save(booking));
    }

    public BookingResponse updateStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        booking.setStatus(status);
        return BookingResponse.fromEntity(bookingRepository.save(booking));
    }
}
