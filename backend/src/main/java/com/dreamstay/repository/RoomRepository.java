package com.dreamstay.repository;

import com.dreamstay.entity.Room;
import com.dreamstay.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByType(RoomType type);

    boolean existsByRoomNumber(String roomNumber);

    @Query("SELECT r FROM Room r WHERE r.available = true AND r.id NOT IN " +
           "(SELECT b.room.id FROM Booking b WHERE b.status <> 'CANCELLED' AND " +
           "b.checkInDate < :checkOut AND b.checkOutDate > :checkIn)")
    List<Room> findAvailableRooms(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
}
