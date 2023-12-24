package com.missionC.Dashboard.controllers;

import com.missionC.Dashboard.model.*;
import com.missionC.Dashboard.services.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping({"/network"})
public class controller {

    @Autowired
    DeviceService deviceService;

    @GetMapping({"/devices"})
    public ResponseEntity<List<Devices>> getAllDevices(){

        return deviceService.getAllDevices();
    }
    @GetMapping({"/devices-ids"})
    public ResponseEntity<List<Long>> getAllDevicesIds(){
        return deviceService.getAllDevicesIds();
    }
    @GetMapping({"/deviceInfo/{deviceId}"})
    public ResponseEntity<Devices> getDeviceInfo(@PathVariable Long deviceId){
        return deviceService.getDevice(deviceId);
    }
    @GetMapping({"/dashboard"})
    public String dashboard(){
        return "Network Dashboard ";
    }

    @GetMapping({"/alert-table"})
    public ResponseEntity<List<AlertTable>> getAllAlert(){
        return  deviceService.getAllAlert();
    }

    @GetMapping({"/alert-table/{deviceId}"})
    public ResponseEntity<List<AlertTable>> getAlerts(@PathVariable Long deviceId){
        return  deviceService.getAlerts(deviceId);
    }
    @GetMapping({"/traffic"})
    public ResponseEntity<List<Traffic>> getTraffic(){
        return deviceService.getAllTraffic();
    }
    @GetMapping({"/traffic/{deviceId}"})
    public ResponseEntity<List<Traffic>> getDeviceTraffic(@PathVariable Long deviceId){
        return deviceService.getDeviceTraffic(deviceId);
    }

    @GetMapping({"/rtn-traffic/{deviceTypes}"})
    public ResponseEntity<List<Map<String,Long>>> getRtnTraffic(@PathVariable List<String> deviceTypes){
        return deviceService.getRtnTraffic(deviceTypes);
    }
    @GetMapping({"/alertInfo/{deviceId}"})
    public ResponseEntity<Map<String,Integer>> getAlertCounts(@PathVariable Long deviceId){
        Map<String , Integer> alertCounts=new HashMap<>();
        alertCounts.put("criticalAct",deviceService.getAlertCount(deviceId,"Critical","Active"));
        alertCounts.put("warningAct",deviceService.getAlertCount(deviceId,"Warning","Active"));
        alertCounts.put("criticalSol",deviceService.getAlertCount(deviceId,"Critical","Solved"));
            alertCounts.put("warningSol",deviceService.getAlertCount(deviceId,"Warning","Solved"));
        return ResponseEntity.ok(alertCounts);
    }
    @GetMapping({"/get-health"})
    public ResponseEntity<List<Health>> getAllHealth(){
        return deviceService.getAllHealth();
    }

    @GetMapping("/get-packet/{deviceId}")
    public ResponseEntity<List<Map<String, Object>>> getPacket(@PathVariable Long deviceId) {
        List<Map<String, Object>> result = deviceService.getTimestampAndPacketLoss(deviceId);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/get-allPacket/{deviceTypes}")
    public ResponseEntity<List<Map<String, Object>>> getAllPacket(@PathVariable List<String> deviceTypes) {
        List<Map<String, Object>> result = deviceService.getAllPacket(deviceTypes);
        return ResponseEntity.ok(result);
    }
    @GetMapping({"/get-throughput/{deviceId}"})
    public ResponseEntity<List<Map<String,Object>>> getThroughput(@PathVariable Long deviceId){
        List<Map<String,Object>> result= deviceService.getTimestampAndThroughput(deviceId);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/get-allThroughput/{deviceTypes}")
    public ResponseEntity<List<Map<String, Object>>> getAllThroughput(@PathVariable List<String> deviceTypes) {
        List<Map<String, Object>> result = deviceService.getAllThroughput(deviceTypes);
        return ResponseEntity.ok(result);
    }
    @GetMapping({"/get-latency/{deviceId}"})
    public ResponseEntity<List<Map<String,Object>>> getLatency(@PathVariable Long deviceId){
        List<Map<String,Object>> result= deviceService.getTimestampAndLatency(deviceId);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/get-allLatency/{deviceTypes}")
    public ResponseEntity<List<Map<String, Object>>> getAllLatency(@PathVariable List<String> deviceTypes) {
        List<Map<String, Object>> result = deviceService.getAllLatency(deviceTypes);
        return ResponseEntity.ok(result);
    }
    @GetMapping({"/get-uptime/{deviceId}"})
    public ResponseEntity<List<Map<String,Object>>> getUptime(@PathVariable Long deviceId){
        List<Map<String,Object>> result= deviceService.getTimestampAndUptime(deviceId);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/get-avg-uptime/{deviceTypes}")
    public ResponseEntity<List<Map<String, Object>>> getAvgUptime(@PathVariable List<String> deviceTypes) {
        List<Map<String, Object>> result = deviceService.getAvgUptime(deviceTypes);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/devices/historical-status")
    public ResponseEntity<List<DeviceStatusHistory>> getDeviceStatusHistory() {
        try {
            List<DeviceStatusHistory> history = deviceService.getAllDeviceStatusHistory().getBody();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/devices/routers-status")
    public ResponseEntity<Map<String, Integer>> getRouterStatus(){
        Map<String, Integer> status=new HashMap<>();
        status.put("online", deviceService.getOnlineRouterCount());
        status.put("offline", deviceService.getOfflineRouterCount());
        return ResponseEntity.ok(status);
    }
    @GetMapping("/devices/switch-status")
    public ResponseEntity<Map<String,Integer>> getSwitchStatus(){
        Map<String,Integer> status=new HashMap<>();
        status.put("online",deviceService.getOnlineSwitchCount());
        status.put("offline", deviceService.getOfflineSwitchCount());
        return ResponseEntity.ok(status);
    }
    @GetMapping("/devices/server-status")
    public ResponseEntity<Map<String,Integer>> getServerStatus(){
        Map<String,Integer> status=new HashMap<>();
        status.put("online",deviceService.getOnlineServerCount());
        status.put("offline", deviceService.getOfflineServerCount());
        return ResponseEntity.ok(status);
    }

    @GetMapping("/average-uptime")
    public ResponseEntity<List<Map<String, Object>>> getAverageUptimePerDevice() {
        return deviceService.getAverageUptimePerDevice();
    }
}
