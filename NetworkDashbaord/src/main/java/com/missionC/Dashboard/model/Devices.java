package com.missionC.Dashboard.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Devices {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deviceID;
    private String devicename;
    private String devicetype;
    private String devicestatus;
    private String iPAddress;
    private Long inboundTraffic;
    private Long outboundTraffic;
}
