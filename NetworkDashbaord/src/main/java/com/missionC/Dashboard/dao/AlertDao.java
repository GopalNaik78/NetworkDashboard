package com.missionC.Dashboard.dao;

import com.missionC.Dashboard.model.AlertTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertDao extends JpaRepository<AlertTable, Long> {
    Integer countByDeviceidAndStatusAndReviewstatus(Long deviceId, String status, String revStatus);

    List<AlertTable> getByDeviceid(Long deviceId);
}
