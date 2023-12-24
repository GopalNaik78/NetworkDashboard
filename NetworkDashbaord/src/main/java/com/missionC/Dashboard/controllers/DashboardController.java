package com.missionC.Dashboard.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/index")
public class DashboardController {

    @GetMapping
    public String showDashboard(Model model) {
        // Add any model attributes if needed
        return "index";
    }
    @GetMapping("/allDevices")
    public String showDas(Model model) {
        // Add any model attributes if needed
        return "dashboard";
    }
    @GetMapping("/ntwTraffic")
    public String showNtwTraffic(Model model) {
        // Add any model attributes if needed
        return "networkTraffic";
    }
    @GetMapping("/alert")
    public String showAlert(Model model) {
        // Add any model attributes if needed
        return "alertBlock";
    }
    @GetMapping("/packet-loss")
    public String showPacket(Model model) {
        // Add any model attributes if needed
        return "packetLoss";
    }
    @GetMapping("/throughput")
    public String showthroughput(Model model) {
        // Add any model attributes if needed
        return "throughput";
    }
    @GetMapping("/latency")
    public String showLatency(Model model) {
        // Add any model attributes if needed
        return "latency";
    }
    @GetMapping("/uptime")
    public String showUptime(Model model) {
        // Add any model attributes if needed
        return "uptime";
    }
    @GetMapping("/health")
    public String showHealth(Model model) {
        // Add any model attributes if needed
        return "health";
    }
    @GetMapping("/single")
    public String showSingle(Model model) {
        return "singleDevice";
    }
}

