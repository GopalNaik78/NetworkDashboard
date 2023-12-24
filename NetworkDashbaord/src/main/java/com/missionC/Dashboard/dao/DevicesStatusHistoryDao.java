package com.missionC.Dashboard.dao;

import com.missionC.Dashboard.model.DeviceStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DevicesStatusHistoryDao extends JpaRepository<DeviceStatusHistory,Long> {
}
