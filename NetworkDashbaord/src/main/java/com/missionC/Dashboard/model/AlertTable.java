package com.missionC.Dashboard.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
@Table (name = "alertsandnotifications")
public class AlertTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertID;
    private Long deviceid;
    private Timestamp timestamp;
    private String message;
    private String status;
    private String reviewstatus;
}
