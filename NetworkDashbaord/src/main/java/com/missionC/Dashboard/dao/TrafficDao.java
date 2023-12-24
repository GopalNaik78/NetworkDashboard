package com.missionC.Dashboard.dao;

import com.missionC.Dashboard.model.Traffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficDao extends JpaRepository<Traffic,Long> {
    List<Traffic> findByDeviceid(Long deviceId);
}
