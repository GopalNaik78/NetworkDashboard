package com.missionC.Dashboard.dao;

import com.missionC.Dashboard.model.Devices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevicesDao extends JpaRepository<Devices,Long> {

    Integer countByDevicetypeAndDevicestatus(String Device, String Mode);

    @Query("SELECT d.deviceID FROM Devices d")
    List<Long> findAllDeviceID();

    List<Devices> findByDevicetypeIn(List<String> deviceTypes);

//    List<Long> findAllDeviceIds();

    @Query("SELECT d.deviceID FROM Devices d WHERE d.devicetype =:deviceTypes")
    List<Long> findDeviceIdsByDevicetypeIn(@Param("deviceTypes") List<String> deviceTypes);
}
