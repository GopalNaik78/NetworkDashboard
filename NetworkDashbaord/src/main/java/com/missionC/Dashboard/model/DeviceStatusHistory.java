package com.missionC.Dashboard.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "devicestatushistory")
public class DeviceStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long deviceID;
    private Timestamp timestamp;
    private String status;
}
