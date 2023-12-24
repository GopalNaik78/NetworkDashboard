package com.missionC.Dashboard.dao;

import com.missionC.Dashboard.model.Health;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthDao extends JpaRepository<Health,Long> {
    @Query("SELECT h.timestamp, h.packetlossrate FROM Health h WHERE h.deviceID = :deviceId ORDER BY h.timestamp")
    List<Object[]> findTimestampAndPacketLoss(@Param("deviceId") Long deviceId);
    @Query("SELECT h.timestamp, h.throughput FROM Health h WHERE h.deviceID = :deviceId ORDER BY h.timestamp")
    List<Object[]> findTimestampAndThroughput(@Param("deviceId") Long deviceId);
    @Query("SELECT h.timestamp, h.latency FROM Health h WHERE h.deviceID = :deviceId ORDER BY h.timestamp")
    List<Object[]> findTimestampAndLatency(@Param("deviceId") Long deviceId);
    @Query("SELECT h.timestamp, h.uptime FROM Health h WHERE h.deviceID = :deviceId ORDER BY h.timestamp")
    List<Object[]> findTimestampAndUptime(@Param("deviceId") Long deviceId);

    long countByDeviceID(Long deviceID);

    @Query("SELECT SUM(h.uptime) FROM Health h WHERE h.deviceID = :deviceId")
    Float sumUptimeByDeviceID(@Param("deviceId") Long deviceId);
}
